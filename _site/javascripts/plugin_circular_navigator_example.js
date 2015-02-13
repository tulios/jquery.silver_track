$(function() {
  var container = $(".track.sample1");
  var track = container.find(".slider-container").silverTrack();

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.install(new SilverTrack.Plugins.CircularNavigator({
    autoPlay: false,
    duration: 3000
  }));

  track.start();


  // =========================================================================
  // Sample 2
  // =========================================================================

  var container = $(".track.sample2");
  var track = container.find(".slider-container").silverTrack();

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.install(new SilverTrack.Plugins.CircularNavigator({
    autoPlay: true,
    duration: 5000
  }));

  track.start();



});
