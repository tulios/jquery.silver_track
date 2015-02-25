jQuery(function() {

  var example = $("#example-7");
  var parent = example.parents(".track");
  var track = example.silverTrack(SilverTrackExample.defaults);

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", parent),
    next: $("a.next", parent)
  }));

  track.install(new SilverTrack.Plugins.BulletNavigator({
    container: $(".bullet-pagination", parent)
  }));

  track.install(new SilverTrack.Plugins.CircularNavigator({
    autoPlay: true,
    duration: 5000
  }));

  track.install(new SilverTrack.Plugins.Css3Animation({
    delayUnit: "s",
    autoHeightDuration: 300,
    autoHeightEasing: "easeInOutCubic",
    autoHeightDelay: 1
  }));

  track.install(new SilverTrack.Plugins.ResponsiveHubConnector({
    layouts: ["phone", "small-tablet", "tablet", "web"],
    onReady: function(track, options, event) {
      options.onChange(track, options, event);
    },

    onChange: function(track, options, event) {
      track.options.mode = "horizontal";
      track.options.autoheight = false;
      track.options.perPage = 4;

      if (event.layout === "small-tablet") {
        track.options.perPage = 3;

      } else if (event.layout === "phone") {
        track.options.mode = "vertical";
        track.options.autoHeight = true;
      }

      track.restart({keepCurrentPage: true});
    }
  }));
  track.start();
});