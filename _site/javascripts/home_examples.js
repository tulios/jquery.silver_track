$(function() {
  // Take a look at Recipes (http://tulios.github.io/jquery.silver_track/how_tos/defining-a-recipe.html) to avoid repetition
  // =========================================================================
  // Sample 1
  // =========================================================================
  var container = $(".track.sample1");
  var track = container.find(".slider-container").silverTrack({duration: 800, touchMode: true});

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.start();

  // =========================================================================
  // Sample 2
  // =========================================================================
  container = $(".track.sample2");
  track = container.find(".slider-container").silverTrack({
    itemClass: "my-item",
    cover: true,
    easing: "easeInOutQuad",
    duration: 600
  });

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.BulletNavigator({
    container: $(".bullet-pagination")
  }));

  track.start();

  // =========================================================================
  // Sample 3
  // =========================================================================
  container = $(".track.sample3");
  track = container.find(".slider-container").silverTrack({
    duration: 600,
    easing: "easeInOutQuad",
    mode: "vertical",
    autoHeight: true
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation({
    autoHeightDuration: 600,
    autoHeightEasing: "easeInOutCubic",
    autoHeightDelay: 800
  }));

  track.start();
});
