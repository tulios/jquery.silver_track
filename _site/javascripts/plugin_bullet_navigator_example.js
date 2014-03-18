$(function() {
  var container = $(".track:first");
  var track = container.find(".slider-container").silverTrack();

  track.install(new SilverTrack.Plugins.BulletNavigator({
    container: $(".bullet-pagination")
  }));

  track.start();
});
