$(function() {
  var container = $(".track:first");
  var track = container.find(".slider-container").silverTrack();

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.start();
});
