//=================================================
// Example 2 and 3 - cover
//=================================================

jQuery(function() {

  $("#example-2, #example-3").each(function() {

    var example = $(this);
    var track = example.silverTrack({cover: true});

    track.install(new SilverTrack.Plugins.Navigator({
      prev: $("a.prev", example.parent().parent()),
      next: $("a.next", example.parent().parent())
    }));

    track.install(new SilverTrack.Plugins.BulletNavigator({
      container: $(".bullet-pagination", example.parent().parent())
    }));

    track.start();

  });

});
