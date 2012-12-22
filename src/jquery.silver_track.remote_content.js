/*!
 * jQuery SilverTrack - Remote Content Plugin
 * https://github.com/tulios/jquery.silver_track
 * version: 0.1.0
 */

(function ($, window, document) {

  $.silverTrackPlugin("RemoteContent", {
    defaults: {
      lazy: true,

      type: "GET",
      params: {},

      beforeSend: null,
      onError: null,
      process: null,
      updateTotalPages: null
    },

    constructor: function(options) {
      this.track = null;
      this.options = options;
      this.ajaxCache = {};
    },

    onInstall: function(track) {
      this.track = track;
      this._updateNavigationControls();
    },

    afterStart: function() {
      this._loadContent(this.track.currentPage, function() {
        this.track.reloadItems();
        this.track.restart();
      });
    },

    _updateNavigationControls: function() {
      var self = this;
      this.track.next = function() {
        var page = self.track.currentPage + 1;
        self._loadContent(page, function() {
          self.track.goToPage(page);
        });
      }
    },

    _loadContent: function(page, contentLoadedCallback) {
      var self = this;
      var url = this._generateUrl(page);

      if (!this.ajaxCache[url]) {

        $.ajax(
          $.extend(this._ajaxDefaultOptions(), {
            url: url,
            success: function(data) {
              self._onSuccessFor(url, data);
              contentLoadedCallback.apply(self);
            }
          })
        );

      } else {
        contentLoadedCallback.apply(self);
      }
    },

    _onSuccessFor: function(url, data) {
      this.ajaxCache[url] = true;
      if (this.options.process) {
        var items = this.options.process(this.track, this.track.options.perPage, data);
        this._updateItemsPosition(items);
      }

      if (this.options.updateTotalPages) {
        this.options.updateTotalPages(this.track, data);
      }

      this.track.reloadItems();
    },

    _onBeforeSend: function(jqXHR, settings) {
      if (this.options.beforeSend) {
        this.options.beforeSend(jqXHR, settings, this.track);
      }
    },

    _onError: function(jqXHR, textStatus, errorThrown) {
      if (window.console) {
        console.debug('SilverTrack.Plugins.RemoteContent - Error:', textStatus);
      }
      if (this.options.onError) {
        this.options.onError(jqXHR, textStatus, errorThrown, this.track);
      }
    },

    _updateItemsPosition: function(items) {
      var lastItem = $("." + this.track.options.itemClass + ":last", this.track.container);

      var width = parseInt(lastItem.css("left"), 10);
      if (width !== 0) {
        width += this.track.itemWidth;
      }

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.css({"left": width + "px"});
        this.track.container.append(item);
        width += item.outerWidth(true);
      }
    },

    _generateUrl: function(page) {
      var url = this.options.url;
      var perPage = this.track.options.perPage;

      if (typeof url === 'function') {
        return url(page, perPage);
      }

      return url.replace(/{page}/, page).replace(/{perPage}/, perPage);
    },

    _ajaxDefaultOptions: function() {
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
