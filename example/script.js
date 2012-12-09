jQuery(function() {

  var track = $(".slider-container").silverTrack();
  $("a.next").click(function(e) {
    e.preventDefault();
    track.next();
  });

  $("a.prev").click(function(e) {
    e.preventDefault();
    track.prev();
  });

});
