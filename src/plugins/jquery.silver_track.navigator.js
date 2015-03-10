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

      this.prev.addClass(this.options.disabledClass).click(this._handlePreviousPageClick.bind(this));
      this.next.addClass(this.options.disabledClass).click(this._handleNextPageClick.bind(this));
    },

    onInstall: function(track) {
      this.track = track;
    },

    onUninstall: function(track) {
      this.prev.off("click");
      this.next.off("click");
      this._enable(this.prev);
      this._enable(this.next);
      this.track = null;
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

    goToNextPage: function() {
      this.track.next();
    },

    goToPreviousPage: function() {
      this.track.prev();
    },

    _handlePreviousPageClick: function(e) {
      e.preventDefault();
      this.goToPreviousPage();
    },

    _handleNextPageClick: function(e) {
      e.preventDefault();
      this.goToNextPage();
    },

    _enable: function(element) {
      element.removeClass(this.options.disabledClass);
    },

    _disable: function(element) {
      element.addClass(this.options.disabledClass);
    }
  });

})(jQuery, window, document);
