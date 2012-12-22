//=================================================
// Example 1 - basic track
//=================================================

jQuery(function() {

  var example = $("#example-1");
  var track = example.silverTrack();

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", example.parent().parent()),
    next: $("a.next", example.parent().parent())
  }));

  track.install(new SilverTrack.Plugins.BulletNavigator({
    container: $(".bullet-pagination", example.parent().parent())
  }));

  track.start();

  //====
  // Extra
  //====
  $("a.reload", example.parent()).click(function(e) {
    e.preventDefault();
    track.restart();
  });

});
