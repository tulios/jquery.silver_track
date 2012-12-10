jQuery(function() {

  $(".slider-container").each(function() {
    var example = $(this);

    var track = example.silverTrack(example.hasClass("big") || example.hasClass("huge") ? {cover: true} : {});
    $("a.next", example.parent().parent()).click(function(e) {
      e.preventDefault();
      track.next();
    });

    $("a.prev", example.parent().parent()).click(function(e) {
      e.preventDefault();
      track.prev();
    });
  });

});
