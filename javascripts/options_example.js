$(function() {
  // =================================================================================================
  // Track with options: {itemClass: "my-item", cover: true, easing: "easeInOutQuad", duration: 600}
  // =================================================================================================

  var container = $(".track.first-example");
  var track = container.find(".slider-container").silverTrack({
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

  track.start();

  // =================================================================================================
  // Track with options: {itemClass: "small-item", perPage: 5, mode: "vertical"}
  // =================================================================================================

  var container = $(".track.second-example");
  var track = container.find(".slider-container").silverTrack({
    itemClass: "small-item",
    perPage: 5,
    mode: "vertical"
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.start();

  // =================================================================================================
  // Track with options: {itemClass: "small-item", perPage: 5, mode: "vertical", animationAxis: "y"}
  // =================================================================================================

  var container = $(".track.third-example");
  var track = container.find(".slider-container").silverTrack({
    itemClass: "small-item",
    perPage: 5,
    mode: "vertical",
    animationAxis: "y"
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.start();

  // =================================================================================================
  // Track with options: {itemClass: "small-item", cover: true, perPage: 5, mode: "vertical", animationAxis: "y"}
  // =================================================================================================

  var container = $(".track.fourth-example");
  var track = container.find(".slider-container").silverTrack({
    itemClass: "small-item",
    cover: true,
    perPage: 5,
    mode: "vertical",
    animationAxis: "y"
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.start();

});
