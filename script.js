jQuery(function() {

  $(".slider-container").each(function() {
    var example = $(this);
    var hasCover = example.hasClass("big") || example.hasClass("huge");

    var track = example.silverTrack({cover: hasCover});
    track.install(new SilverTrack.Plugins.Navigator({
      prev: $("a.prev", example.parent().parent()),
      next: $("a.next", example.parent().parent())
    }));

    track.install(new SilverTrack.Plugins.BulletNavigator({
      container: $(".bullet-pagination", example.parent().parent())
    }));

    track.start();

    $("a.reload", example.parent()).click(function(e) {
      e.preventDefault();
      track.restart();
    });
  });

});
