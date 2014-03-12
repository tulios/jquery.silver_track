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
  // Defining recipes
  // ==========================================================================
  $.silverTrackRecipes("basic", function(factory) {
    factory.createTrack(function(element, options) {
      // Let's tweak a little bit this track
      return element.silverTrack({
        easing: options.easing || "easeInOutQuad",
        duration: options.duration || 600
      });
    });

    factory.installPlugins(function(track, options) {
      var parent = track.container.parents(".track");
      track.install(new SilverTrack.Plugins.Navigator({
        prev: $("a.prev", parent),
        next: $("a.next", parent)
      }));
    });
  });

  // ==========================================================================
  // Track initialization
  // ==========================================================================
  $(".track").each(function() {
    var container = $(this).find(".slider-container");
    var e = container.data("easing");
    var d = container.data("duration");
    $.silverTrackRecipes.create("basic", container, {easing: e, duration: d}).start();
  });
});
