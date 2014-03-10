jQuery(function() {

  $(".track.example-1 .slider-container").each(function() {
    $.silverTrackRecipes.create("basic", $(this)).start();
  });

});
