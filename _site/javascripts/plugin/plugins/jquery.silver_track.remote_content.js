/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * Remote Content
 * version: 0.4.0
 *
 */
(function($, window, document) {

  $.silverTrackPlugin("RemoteContent", {
    defaults: {
      lazy: true,
      prefetchPages: 0,

      type: "GET",
      params: {},

      ajaxFunction: null,
      beforeStart: function(track) {},
      beforeSend: function(track, jqXHR, settings, opts) {},
      beforeAppend: function(track, items, opts) {},
      afterAppend: function(track, items, opts) {},
      process: function(track, perPage, data, opts) {},
      updateTotalPages: function(track, data) {},
      onError: function(track, jqXHR, textStatus, errorThrown, opts) {}
    },

    initialize: function(options) {
      this.track = null;
      this.options = options;
      this.ajaxFunction = this.options.ajaxFunction || this._ajax;
      this._defaultOptions();
    },

    onInstall: function(track) {
      this.track = track;
      this._updateNavigationControls();
    },

    afterStart: function() {
      this.options.beforeStart(this.track);
      this._boot();
    },

    afterAnimation: function(track, event) {
      this.loadContentEnabled = true;
    },

    reload: function() {
      this.track.restart();
      this.track.reloadItems();
      this.track.container.empty();
      this._defaultOptions();
      this._boot();
    },

    _defaultOptions: function() {
      this.ajaxCache = {};
      this.filled = false;
      this.loadContentEnabled = true;
      this.prefetchEnabled = true;
    },

    _boot: function() {
      if (this.options.lazy) {

        this._loadContent(this.track.currentPage, function() {
          this.filled = true;
          this.track.restart();
        });

      } else {
        this.filled = true;
      }
    },

    _updateNavigationControls: function() {
      var self = this;
      this.track.next = function() {
        if (self.track.hasNext() && self.loadContentEnabled) {

          var page = self.track.currentPage + 1;
          self.loadContentEnabled = false;
          self._loadContent(page, function() {
            self.track.goToPage(page);
          });

        }
      }
    },

    _loadContent: function(page, contentLoadedCallback) {
      var self = this;
      var url = this._generateUrl(page);

      if (!this.ajaxCache[url]) {

        this.ajaxFunction(
          $.extend(this._ajaxDefaults(), {
            url: url,
            success: function(data) {
              self._onSuccess(url, data, {prefetch: false});
              contentLoadedCallback.apply(self);
              self._prefetchContent(page);
            }
          })
        );

      } else {
        contentLoadedCallback.apply(self);
        this._prefetchContent(page);
      }
    },

    _prefetchContent: function(page) {
      if (!this.prefetchEnabled ||
          !this.options.prefetchPages ||
          page + 1 > this.track.totalPages) {
        return;
      }

      var self = this;
      var queue = [];
      var prefetchOpts = {prefetch: true, currentPage: this.track.currentPage};
      var prefetchedPage = page + 1

      for (var i = 0; i < this.options.prefetchPages; i++) {
        if (prefetchedPage > this.track.totalPages) {
          this.prefetchEnabled = false;
          break;
        }

        var url = this._generateUrl(prefetchedPage++);
        if (this.ajaxCache[url]) {
          continue;
        }

        queue.push(function(prefetchUrl, opts) {
          var params = $.extend(self._ajaxDefaults(opts), {
            url: prefetchUrl,
            success: function(data) {
              self._onSuccess(prefetchUrl, data, opts);
              if (queue.length > 0) {
                queue.shift().apply(self);
              }
            }
          });

          return function() { this.ajaxFunction(params) }
        }(url, prefetchOpts));
      }

      if (queue.length > 0) {
        queue.shift().apply(self);
      }
    },

    _onSuccess: function(url, data, opts) {
      this.ajaxCache[url] = true;
      var items = this.options.process(this.track, this.track.options.perPage, data, opts) || [];

      this.options.beforeAppend(this.track, items, opts);
      this._updateItemsPosition(items);
      this.options.afterAppend(this.track, items, opts);

      this.options.updateTotalPages(this.track, data);
      this.track.reloadItems();
    },

    _onBeforeSend: function(jqXHR, settings, opts) {
      this.options.beforeSend(this.track, jqXHR, settings, opts);
    },

    _onError: function(jqXHR, textStatus, errorThrown, opts) {
      if (window.console) {
        console.info('SilverTrack.Plugins.RemoteContent - Error:', [textStatus, errorThrown, opts]);
      }

      this.options.onError(this.track, jqXHR, textStatus, errorThrown, opts);
    },

    _updateItemsPosition: function(items) {
      if (this.track.options.mode === "horizontal") {
        this._positionHorizontal(items);

      } else if (this.track.options.mode === "vertical") {
        this._positionVertical(items);
      }
    },

    _positionHorizontal: function(items) {
      var lastItem = $("." + this.track.options.itemClass + ":last", this.track.container);

      var width = parseInt(lastItem.css("left"), 10) || 0;
      if (width !== 0) {
        width += this.track.itemWidth;
      }

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.css({"left": width + "px"});
        this.track.container.append(item);
        width += item.outerWidth(true);
      }

      this.track.container.width(width);
    },

    _positionVertical: function(items) {
      var itemWidth = this.track.itemWidth;
      var width = Math.abs(parseInt(this.track.container.css("left"), 10)) || 0;

      if (this.filled) {
        width += itemWidth;
        this.track.container.css("width", (this.track.currentPage + 1) * itemWidth);
      }

      var height = 0;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.css({"left": width + "px", "top": height + "px"});
        this.track.container.append(item);
        height += item.outerHeight(true);
      }
    },

    _generateUrl: function(page) {
      var url = this.options.url;
      var perPage = this.track.options.perPage;

      if (typeof url === 'function') {
        return url(this.track, page, perPage);
      }

      return url.replace(/{page}/, page).replace(/{perPage}/, perPage);
    },

    _ajax: function(opts) {
      $.ajax(opts);
    },

    _ajaxDefaults: function(prefetchOpts) {
      var self = this;
      var opts = $.extend({prefetch: false}, prefetchOpts);

      return {
        context: this.track.container,
        type: this.options.type,
        data: this.options.params,
        beforeSend: function(jqXHR, settings) {
          self._onBeforeSend(jqXHR, settings, opts);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self._onError(jqXHR, textStatus, errorThrown, opts);
        }
      }
    }

  });

})(jQuery, window, document);
