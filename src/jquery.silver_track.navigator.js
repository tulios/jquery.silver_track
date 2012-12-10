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
      this.next.removeClass(this.opts.disabledClass);
    },

    beforePagination: function(track, direction, page, useCover) {
      if (direction === "prev" && page === 1) {
        this.prev.addClass(this.opts.disabledClass);

      } else {
        this.prev.removeClass(this.opts.disabledClass);
      }
    }
  });

  window.SilverTrack.Navigator = SilverTrack.Navigator;

})(jQuery, window, document);
