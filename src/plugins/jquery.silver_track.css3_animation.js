/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.2.2
 *
 * CSS3 Animation
 * version: 0.1.0
 *
 * This plugin depends on modernizr.transforms3d.js
 */

(function($, window, document) {

  $.silverTrackPlugin("Css3Animation", {

    initialize: function(options) {
      this.options = options;
      this.fallback = !Modernizr.csstransforms3d;
    },

    onInstall: function(track) {
      this.track = track
      if (!this.fallback) {
        var self = this;
        this.track.options.animateFunction = function(shift, duration, easing, afterCallback) {
          self._cssAnimate(shift, duration, easing, afterCallback);
        }
      }
    },

    beforeStart: function() {
      this._setupTransition();
    },

    _setupTransition: function() {
      var element = this.track.container;
      var duration = this.track.options.duration;
      var easing = this._easingFunctionToCubicBezier(this.track.options.easing);

      // enabling hardware acceleration into the parent
      this._applyTransform3d(element.parent(), 0);

      // pre configuring container
      element.css({
        "-webkit-transition-duration": duration + "ms",
        "-moz-transition-duration": duration + "ms",
        "-o-transition-duration": duration + "ms",
        "-ms-transition-duration": duration + "ms",
        "transition-duration": duration + "ms",
        "-webkit-transition-timing-function": easing,
        "-moz-transition-timing-function": easing,
        "-o-transition-timing-function": easing,
        "-ms-transition-timing-function": easing,
        "transition-timing-function": easing
      });
    },

    _cssAnimate: function(shift, duration, easing, afterCallback) {
      var element = this.track.container;
      element.on("webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionend", function(){
        afterCallback();
        element.off("webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionend");
      });

      this._applyTransform3d(element, shift);
    },

    _applyTransform3d: function(element, shift) {
      element.css({
        "-webkit-transform": "translate3d(-" + shift + "px, 0px, 0px)",
        "-moz-transform": "translate3d(-" + shift + "px, 0px, 0px)",
        "-o-transform": "translate3d(-" + shift + "px, 0px, 0px)",
        "-ms-transform": "translate3d(-" + shift + "px, 0px, 0px)",
        "transform": "translate3d(-" + shift + "px, 0px, 0px)"
      });
    },

    _easingFunctionToCubicBezier: function(easing) {
      if (!this.cubicBezierMap) {
        this.cubicBezierMap = {
          "linear": "cubic-bezier(0.250, 0.250, 0.750, 0.750)",
          "ease": "cubic-bezier(0.250, 0.100, 0.250, 1.000)",
          "swing": "cubic-bezier(0.250, 0.100, 0.250, 1.000)", // compatibility

          "ease-in": "cubic-bezier(0.420, 0.000, 1.000, 1.000)",
          "easeIn": "cubic-bezier(0.420, 0.000, 1.000, 1.000)",

          "ease-out": "cubic-bezier(0.000, 0.000, 0.580, 1.000)",
          "easeOut": "cubic-bezier(0.000, 0.000, 0.580, 1.000)",

          "ease-in-out": "cubic-bezier(0.420, 0.000, 0.580, 1.000)",
          "easeInOut": "cubic-bezier(0.420, 0.000, 0.580, 1.000)",

          "easeInQuad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
          "easeInCubic": "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
          "easeInQuart": "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
          "easeInQuint": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
          "easeInSine": "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
          "easeInExpo": "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
          "easeInCirc": "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
          "easeInBack": "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
          "easeOutQuad": "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
          "easeOutCubic": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
          "easeOutQuart": "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
          "easeOutQuint": "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
          "easeOutSine": "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
          "easeOutExpo": "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
          "easeOutCirc": "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
          "easeOutBack": "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
          "easeInOutQuad": "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
          "easeInOutCubic": "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
          "easeInOutQuart": "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
          "easeInOutQuint": "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
          "easeInOutSine": "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
          "easeInOutExpo": "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
          "easeInOutCirc": "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
          "easeInOutBack": "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
        }
      }

      return this.cubicBezierMap[easing] || this.cubicBezierMap["ease"];
    }

  });

})(jQuery, window, document);
