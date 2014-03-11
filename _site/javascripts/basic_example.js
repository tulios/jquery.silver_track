$(function() {
  var container = $(".my-track");
  var track = container.find(".slider-container").silverTrack();

  // install the plugins you want, in our case Navigator
  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.start();
});
