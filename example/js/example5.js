jQuery(function() {

  var example = $("#example-5");
  var parent = example.parents(".track");
  var track = example.silverTrack({
    duration: 800,
    easing: "easeInOutQuad"
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", parent),
    next: $("a.next", parent)
  }));

  track.install(new SilverTrack.Plugins.Css3Animation());

  track.start();

});
