/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * Navigator
 * version: 0.2.0
 *
 */
(function($, window, document) {

  /*
   * track.install(new SilverTrack.Plugins.Navigator({
   *   prev: $("a.prev"),
   *   next: $("a.next")
   * }));
   *
   */
  $.silverTrackPlugin("Navigator", {
    defaults: {
      disabledClass: "disabled",
      beforePagination: null
    },

    initialize: function(options) {
      this.track = null;
      this.options = options;
      this.prev = this.options.prev;
      this.next = this.options.next;

      var self = this;
      this.prev.addClass(this.options.disabledClass).click(function(e) {
        e.preventDefault();
        self.track.prev();
      });

      this.next.addClass(this.options.disabledClass).click(function(e) {
        e.preventDefault();
        self.track.next();
      });
    },

    onInstall: function(track) {
      this.track = track;
    },

    afterStart: function() {
      this.afterAnimation();
    },

    afterAnimation: function() {
      this.track.hasPrev() ? this._enable(this.prev) : this._disable(this.prev);
      this.track.hasNext() ? this._enable(this.next) : this._disable(this.next);
    },

    afterRestart: function() {
      this.afterAnimation();
    },

    onTotalPagesUpdate: function() {
      this.afterAnimation();
    },

    beforePagination: function(track, event) {
      if (this.options.beforePagination) {
        this.options.beforePagination(track, event);
      }
    },

    _enable: function(element) {
      element.removeClass(this.options.disabledClass);
    },

    _disable: function(element) {
      element.addClass(this.options.disabledClass);
    }
  });

})(jQuery, window, document);
