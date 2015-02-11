/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * CSS3 Animation
 * version: 0.1.1
 *
 * This plugin depends on modernizr.transforms3d.js
 */

(function($, window, document) {

  var BrowserPrefixes = ["webkit", "moz", "o", "ms"];

  $.silverTrackPlugin("Css3Animation", {
    defaults: {
      durationUnit: "ms",
      delayUnit: null,

      setupParent: true,
      setupTransitionProperty: true,
      setupTransitionDuration: true,
      setupTransitionTimingFunction: true,
      setupTransitionDelay: true,

      slideDelay: 0,
      autoHeightDuration: null,
      autoHeightEasing: null,
      autoHeightDelay: null
    },

    initialize: function(options) {
      this.options = options;
      this.fallback = !Modernizr.csstransforms3d;
    },

    onInstall: function(track) {
      this.track = track
      if (!this.fallback) {
        var self = this;
        this.track.options.animateFunction = function(movement, duration, easing, afterCallback) {
          self.cssAnimate(movement, duration, easing, afterCallback);
        }
      }
    },

    beforeStart: function() {
      this._setupTransition();
    },

    cssAnimate: function(movement, duration, easing, afterCallback) {
      var timeout = 0;
      var element = this.track.container;
      var transitionEndEvent = this._getTransitionEndEvent();
      var animationEnded = function() {
        if (afterCallback !== null && afterCallback !== undefined) {
          afterCallback();
        }
      }

      element.one(transitionEndEvent, function(){
        animationEnded();
        clearTimeout(timeout);
      });

      this._setupTransition(duration);

      if (!!movement.left || !!movement.top) {
        this._applyTransform3d(element, movement);

      } else {
        element.css(movement);
      }

      timeout = setTimeout(function() { animationEnded() }, duration);
    },

    _setupTransition: function(animationDuration) {
      var autoHeight = this.track.options.autoHeight;
      var element = this.track.container;
      var values;

      // enabling hardware acceleration into the parent
      if (this.options.setupParent) {
        this._applyTransform3d(element.parent(), {left: 0});
      }

      // pre configuring container
      if (this.options.setupTransitionProperty) {
        var eachPrefixCallback = function(prefix, value) {
          var transform = "-" + prefix + "-" + value;
          return autoHeight ? transform + ", height" : transform;
        }

        var vanillaCallback = function(value) {
          return autoHeight ? value + ", height" : value;
        }

        element.css(
          this._toCompatibleVersion(
            "transition-property",
            "transform",
            eachPrefixCallback,
            vanillaCallback
          )
        );
      }

      if (this.options.setupTransitionDuration) {
        var duration = this._toDuration(this.track.options.duration);

        if (animationDuration === 0) {
          duration = this._toDuration(0);
          this._cleanElementTransition();
        }

        var autoHeightDuration = this._toDuration(this.options.autoHeightDuration || this.track.options.duration);
        values = autoHeight ? [duration, autoHeightDuration] : [duration];
        element.css(this._toCompatibleVersion("transition-duration", values.join(", ")));
      }

      if (this.options.setupTransitionTimingFunction) {
        var easing = this._easingFunctionToCubicBezier(this.track.options.easing);
        var autoHeightEasing = this._easingFunctionToCubicBezier(this.options.autoHeightEasing || this.track.options.easing);
        values = autoHeight ? [easing, autoHeightEasing] : [easing];
        element.css(this._toCompatibleVersion("transition-timing-function", values.join(", ")));
      }

      if (this.options.setupTransitionDelay) {
        var delay = this._toDelay(this.options.slideDelay);
        var autoHeightDelay = this._toDelay(this.options.autoHeightDelay || this.options.slideDelay);
        values = autoHeight ? [delay, autoHeightDelay] : [delay];
        element.css(this._toCompatibleVersion("transition-delay", values.join(", ")));
      }
    },

    _cleanElementTransition: function() {
      this.track.container.css(this._toCompatibleVersion("transition", ""));
    },

    _applyTransform3d: function(element, movement) {
      var left = movement.left || "0px";
      var top = movement.top || "0px";
      element.css(this._toCompatibleVersion("transform", "translate3d(" + left + ", " + top + ", 0px)"));
    },

    _toDuration: function(number) {
      return number + this.options.durationUnit;
    },

    _toDelay: function(number) {
      return number + (this.options.delayUnit || this.options.durationUnit);
    },

    _toCompatibleVersion: function(name, value, eachCallback, vanillaCallback) {
      var output = {};
      $.each(BrowserPrefixes, function() {
        var str = !!eachCallback ? eachCallback(this, value) : value;
        output["-" + this + "-" + name] = str;
      });

      output[name] = !!vanillaCallback ? vanillaCallback(value) : value;
      return output;
    },

    _easingFunctionToCubicBezier: function(easing) {
      return SilverTrack.Plugins.Css3Animation.CubicBezierMap[easing] || CubicBezierMap["ease"];
    },

    _getTransitionEndEvent: function(){
      var transitions = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd otransitionend',
        'transition'       : 'transitionend'
      };

      for(var t in transitions){
        if(this.track.container.get(0).style[t] !== undefined){
            return transitions[t];
        }
      }
    }

  });

  SilverTrack.Plugins.Css3Animation.CubicBezierMap = {
    "linear": "cubic-bezier(0.25, 0.25, 0.75, 0.75)",
    "ease": "cubic-bezier(0.25, 0.1, 0.25, 1)",
    "swing": "cubic-bezier(0.25, 0.1, 0.25, 1)", // compatibility

    "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
    "easeIn": "cubic-bezier(0.42, 0, 1, 1)",

    "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
    "easeOut": "cubic-bezier(0, 0, 0.58, 1)",

    "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
    "easeInOut": "cubic-bezier(0.42, 0, 0.58, 1)",

    "easeInQuad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    "easeInCubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    "easeInQuart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
    "easeInQuint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    "easeInSine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
    "easeInExpo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
    "easeInCirc": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
    "easeInBack": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
    "easeOutQuad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "easeOutCubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
    "easeOutQuart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeOutQuint": "cubic-bezier(0.23, 1, 0.32, 1)",
    "easeOutSine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
    "easeOutExpo": "cubic-bezier(0.19, 1, 0.22, 1)",
    "easeOutCirc": "cubic-bezier(0.075, 0.82, 0.165, 1)",
    "easeOutBack": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "easeInOutQuad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
    "easeInOutCubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
    "easeInOutQuart": "cubic-bezier(0.77, 0, 0.175, 1)",
    "easeInOutQuint": "cubic-bezier(0.86, 0, 0.07, 1)",
    "easeInOutSine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
    "easeInOutExpo": "cubic-bezier(1, 0, 0, 1)",
    "easeInOutCirc": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
    "easeInOutBack": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  }

})(jQuery, window, document);
