/*!
 * jQuery SilverTrack - Navigator Plugin
 * https://github.com/tulios/jquery.silver_track
 * version: 0.1.0
 */

(function ($, window, document) {

  $.fn.silverTrack.navigatorOptions = {
    disabledClass: "disabled"
  };

  SilverTrack.Navigator = function(opts) {
    this.opts = $.extend({}, $.fn.silverTrack.navigatorOptions, opts);
    this.track = null;
    this.prev = this.opts.prev;
    this.next = this.opts.next;

    var self = this;
    this.prev.addClass(this.opts.disabledClass).click(function(e) {
      e.preventDefault();
      self.track.prev();
    });

    this.next.addClass(this.opts.disabledClass).click(function(e) {
      e.preventDefault();
      self.track.next();
    });
  }

  SilverTrack.Navigator.prototype = $.extend({}, SilverTrack.Plugin, {
    onInstall: function(track) {
      this.track = track;
    },

    afterStart: function() {
      if (this.track.hasPrev()) {
        this._enable(this.prev);
      }

      if (this.track.hasNext()) {
        this._enable(this.next);
      }
    },

    afterAnimation: function() {
      this.track.hasPrev() ? this._enable(this.prev) : this._disable(this.prev);
      this.track.hasNext() ? this._enable(this.next) : this._disable(this.next);
    },

    afterRestart: function() {
      this.afterAnimation();
    },

    _enable: function(element) {
      element.removeClass(this.opts.disabledClass);
    },

    _disable: function(element) {
      element.addClass(this.opts.disabledClass);
    }
  });

  window.SilverTrack.Navigator = SilverTrack.Navigator;

})(jQuery, window, document);
