/*!
 * ResponsiveHub - JavaScript goodies for Responsive Design
 * https://github.com/globocom/responsive-hub
 * version: 0.4.0
 */

(function ($, window, document) {

  $.responsiveHub = function(settings) {
    if (typeof settings === "object") {
      ResponsiveHub.init(settings);

    } else if (typeof settings === "string") {
      var args = [].splice.call(arguments, 0, arguments.length);
      var methodName = args.splice(0, 1)[0];

      if (ResponsiveHub[methodName]) {
        return ResponsiveHub[methodName].apply(ResponsiveHub, args);
      } else {
        if (window.console && window.console.log) {
          console.log("[ResponsiveHub] Undefined method '" + methodName + "'");
        }
      }
    }
  };

  var ResponsiveHub = {
    currentLayout: null,
    resizeBound: false,
    hasMediaQuerySupport: false,
    windowObj: null,
    loaded: false,
    resizeStopDelay: 500,
    _resizeTimer: null,

    init: function(settings) {
      if (!this.loaded) {
        this.loaded = true;
        this.windowObj = this._getWindow();
        this.layouts = settings.layouts;
        this.defaultLayout = settings.defaultLayout;

        this._boot();
      }
    },

    self: function() {
      return this;
    },

    width: function() {
      return this.windowObj.width();
    },

    layout: function() {
      if (!this.hasMediaQuerySupport) {
        return this.defaultLayout;
      }

      var widths = [];
      var keys = this._keys(this.layouts);
      for (var j in keys) {
        widths.push(parseInt(keys[j], 10));
      }

      widths.sort(function(a,b){return b - a});
      var width = this.width();
      for (var i in widths) {
        var w = widths[i];
        if (width >= w) return this.layouts[w];
      }

      return this.layouts[widths[widths.length - 1]];
    },

    ready: function(layout, callback) {
      this._bind("responsiveready", layout, callback);
    },

    change: function(layout, callback) {
      this._bind("responsivechange", layout, callback);
    },

    isResizing: function() {
      return this._resizeTimer !== null;
    },

    resizeStart: function(callback) {
      this.windowObj.bind("resizeStart", callback);
    },

    resizeStop: function(callback) {
      this.windowObj.bind("resizeStop", callback);
    },

    isTouch: function() {
      var wnd = (this.windowObj || this._getWindow()).get(0);
      return !!(('ontouchstart' in wnd) || (wnd.DocumentTouch && wnd.document instanceof DocumentTouch));
    },

    hasFlash: function() {
      try { return !! new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); } catch(e1) {}
      var mimeType = this._mimeTypeFlash();
      return !! (mimeType && mimeType.enabledPlugin);
    },

    _updateLayout: function() {
      var self = $.responsiveHub("self");
      var layout = self.layout();

      if (layout != self.currentLayout) {
        self.currentLayout = layout;
        self.windowObj.trigger("responsivechange" + layout, [self._newEvent()]);
      }
    },

    _resizeStartStop: function(event) {
      var self = $.responsiveHub("self");

      if (self._resizeTimer) {
        clearTimeout(self._resizeTimer);
      } else {
        self.windowObj.trigger("resizeStart", [event]);
      }

      self._resizeTimer = setTimeout(function() {
        self._resizeTimer = null;
        self.windowObj.trigger("resizeStop", [event]);
      }, self.resizeStopDelay);
    },

    _boot: function() {
      this.hasMediaQuerySupport = Modernizr.mq("only all");
      if (!this.resizeBound && this.hasMediaQuerySupport) {

        this.windowObj.bind("resize", this._updateLayout);
        this.windowObj.bind("resize", this._resizeStartStop);

        this.resizeBound = true;
      }

      if (!this.currentLayout) {
        this.currentLayout = this.layout();
        var readyEvent = "responsiveready" + this.currentLayout;

        this.windowObj.trigger(readyEvent, [this._newEvent()]);
        this.windowObj.unbind(readyEvent);
      }
    },

    _unbind: function() {
      $(window).unbind(".responsivehub");
    },

    _bind: function(namespace, layout, callback) {
      var self = this;
      var layouts = this._flatten(this._isArray(layout) ? layout : [layout]);
      var eventCallback = function(event, responsiveHubEvent) {
        callback(responsiveHubEvent);
      }

      $.each(layouts, function(index, value) {
        $(window).bind(namespace + value + ".responsivehub", eventCallback);
      });
    },

    _newEvent: function() {
      return {layout: this.currentLayout, touch: this.isTouch()};
    },

    // https://github.com/jiujitsumind/underscorejs/blob/master/underscore.js#L644
    _keys: Object.keys || function(obj) {
      var keys = [];
      for (var key in obj) if (obj.hasOwnProperty(key)) keys[keys.length] = key;
      return keys;
    },

    _flatten: function(array, shallow) {
      var self = this;
      var flatten = function(input, shallow, output) {
        for (var i = 0; i < input.length; i++) {
          var value = input[i];
          if (self._isArray(value)) {
            shallow ? output.push(value) : flatten(value, shallow, output);
          } else {
            output.push(value);
          }
        }
        return output;
      }

      return flatten(array, shallow, []);
    },

    _getWindow: function() {
      return $(window);
    },

    _mimeTypeFlash: function() {
      return navigator.mimeTypes["application/x-shockwave-flash"];
    },

    _isArray: Array.isArray || function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }
  };

})(jQuery, window, document);
