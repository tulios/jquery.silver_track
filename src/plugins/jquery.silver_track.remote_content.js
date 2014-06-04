/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * Remote Content
 * version: 0.3.0
 *
 */
(function($, window, document) {

  /*
   * track.install(new SilverTrack.Plugins.RemoteContent({
   *
   *   // A string or a function to generate the URL
   *   url: function(track, page, perPage) {
   *     return "/my/url/page/" + page;
   *   },
   *
   *   beforeStart: function(track) {
   *   },
   *
   *   beforeSend: function(track) {
   *   },
   *
   *   // It should return an array with the elements to be appended to
   *   // the container
   *   process: function(track, perPage, json) {
   *     var data = json.data;
   *     var array = [];
   *
   *     for (var i = 0; i < perPage; i++) {
   *       array.push(
   *         $("<div></div>", {"class": "item"}).
   *         append($("<img>", {"src": data[i].img_url})).
   *         append($("<p></p>", {"text": data[i].title}))
   *       );
   *     }
   *
   *     return array;
   *   },
   *
   *   beforeAppend: function(track, items) {
   *   },
   *
   *   updateTotalPages: function(track, json) {
   *     track.updateTotalPages(json.total_pages);
   *   }
   * }));
   *
   */
  $.silverTrackPlugin("RemoteContent", {
    defaults: {
      lazy: true,

      type: "GET",
      params: {},

      ajaxFunction: null,
      beforeStart: function(track) {},
      beforeSend: function(track, jqXHR, settings) {},
      beforeAppend: function(track) {},
      afterAppend: function(track) {},
      process: function(track, perPage, data) {},
      updateTotalPages: function(track, data) {},
      onError: function(track, jqXHR, textStatus, errorThrown) {}
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
              self._onSuccess(url, data);
              contentLoadedCallback.apply(self);
            }
          })
        );

      } else {
        contentLoadedCallback.apply(self);
      }
    },

    _onSuccess: function(url, data) {
      this.ajaxCache[url] = true;
      var items = this.options.process(this.track, this.track.options.perPage, data) || [];

      this.options.beforeAppend(this.track, items);
      this._updateItemsPosition(items);
      this.options.afterAppend(this.track, items);

      this.options.updateTotalPages(this.track, data);
      this.track.reloadItems();
    },

    _onBeforeSend: function(jqXHR, settings) {
      this.options.beforeSend(this.track, jqXHR, settings);
    },

    _onError: function(jqXHR, textStatus, errorThrown) {
      if (window.console) {
        console.info('SilverTrack.Plugins.RemoteContent - Error:', textStatus);
      }

      this.options.onError(this.track, jqXHR, textStatus, errorThrown);
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

    _ajaxDefaults: function() {
      var self = this;
      return {
        context: this.track.container,
        type: this.options.type,
        data: this.options.params,
        beforeSend: function(jqXHR, settings) {
          self._onBeforeSend(jqXHR, settings);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self._onError(jqXHR, textStatus, errorThrown);
        }
      }
    }

  });

})(jQuery, window, document);
