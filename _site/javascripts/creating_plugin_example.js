$(function() {
  // =========================================================================
  // Plugin definition
  // =========================================================================
  $.silverTrackPlugin("ConfirmWhenItemClicked", {
    defaults: {
      message: "Really?"
    },

    initialize: function(options) {
      this.options = options;
    },

    beforeStart: function(track) {
      var self = this;
      var itemSelector = "." + track.options.itemClass;
      track.container.find(itemSelector).off("click").click(function(e) {
        if (!confirm(self.options.message)) {
          e.preventDefault();
        }
      });
    }
  });

  // ==========================================================================
  // Track initialization
  // ==========================================================================
  var container = $(".my-track");
  var track = container.find(".slider-container").silverTrack();

  track.install(new SilverTrack.Plugins.ConfirmWhenItemClicked());

  track.start();
});
