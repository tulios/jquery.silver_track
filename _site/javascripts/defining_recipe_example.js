$(function() {
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

  $.silverTrackRecipes("complex", function(factory) {
    factory.createTrack(function(element, options) {
      return $.silverTrackRecipes.create("basic", element, options);
    });

    factory.installPlugins(function(track, options) {
      track.install(new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parents(".track"))
      }));
    });
  });

  // ==========================================================================
  // Track initialization
  // ==========================================================================
  $(".track").each(function() {
    var container = $(this).find(".slider-container");
    var recipe = container.data("recipe");
    var opts = container.data("opts");
    $.silverTrackRecipes.create(recipe, container, opts).start();
  });
});
