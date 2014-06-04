/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * ResponsiveHub Connector
 * version: 0.1.0
 *
 * This plugin depends on modernizr.mediaqueries.js
 */
(function($, window, document) {

  /*
   * track.install(new SilverTrack.Plugins.ResponsiveHubConnector({
   *   layouts: ["phone", "small-tablet", "tablet", "web"],
   *   onReady: function(track, options, event) {},
   *   onChange: function(track, options, event) {}
   * }));
   *
   */
  $.silverTrackPlugin("ResponsiveHubConnector", {
    initialize: function(options) {
      this.options = options;
      this.layouts = this.options.layouts;
      this.enabled = !!$.responsiveHub;
    },

    onInstall: function(track) {
      this.track = track;

      if (this.enabled) {
        var self = this;
        $.responsiveHub("ready", this.layouts, function(event) {
          self.options.onReady(self.track, self.options, event);
        });

        $.responsiveHub("change", this.layouts, function(event) {
          self.options.onChange(self.track, self.options, event);
        });
      }
    }
  });

})(jQuery, window, document);
