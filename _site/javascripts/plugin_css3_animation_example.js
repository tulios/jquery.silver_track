$(function() {
  // =========================================================================
  // Without options
  // =========================================================================
  var container = $(".track.sample1");
  var track = container.find(".slider-container").silverTrack({duration: 800});

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.start();

  // =========================================================================
  // Changinh the easing
  // =========================================================================
  container = $(".track.sample2");
  track = container.find(".slider-container").silverTrack({
    duration: 1000,
    easing: "easeInOutQuad"
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.start();

  // =========================================================================
  // Vertical track with autoHeight and some options
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
    delayUnit: "s",
    autoHeightDuration: 300,
    autoHeightEasing: "easeInOutCubic",
    autoHeightDelay: 1
  }));

  track.start();
});
