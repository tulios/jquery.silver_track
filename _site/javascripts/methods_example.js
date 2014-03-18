$(function() {
  // =========================================================================
  // Basic track to demonstrate the methods usage
  // =========================================================================

  var container = $(".track:first");
  var track = container.find(".slider-container").silverTrack();

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  track.start();

  // =========================================================================
  // Helper function just to improve the example
  // =========================================================================
  var output = function(text) {
    var consoleInfo = $(".console .info");
    consoleInfo.
      val(function(_, val){ return val + text + "\n"; }).
      scrollTop(consoleInfo.get(0).scrollHeight);
  }

  // =========================================================================
  // Button samples
  // =========================================================================
  $(".commands .go-to-page").off("click").click(function(e) {
    e.preventDefault();
    var page = parseInt($(".go-to-page-field").val(), 10);
    track.goToPage(page);
    output("track.goToPage(" + page + ")");
  });

  $(".commands .prev").off("click").click(function(e) {
    track.prev();
    output("track.prev()");
  });

  $(".commands .next").off("click").click(function(e) {
    track.next();
    output("track.next()");
  });

  $(".commands .has-prev").off("click").click(function(e) {
    track.hasPrev();
    output("track.hasPrev() => " + track.hasPrev());
  });

  $(".commands .has-next").off("click").click(function(e) {
    track.hasNext();
    output("track.hasNext() => " + track.hasNext());
  });

  $(".commands .restart").off("click").click(function(e) {
    track.restart();
    output("track.restart()");
  });

  $(".commands .restart-keep-current-page").off("click").click(function(e) {
    track.restart({keepCurrentPage: true});
    output("track.restart({keepCurrentPage: true})");
  });

  $(".commands .restart-page-2").off("click").click(function(e) {
    track.restart({page: 2, animate: true});
    output("track.restart({page: 2, animate: true})");
  });

  $(".commands .restart-animate-false").off("click").click(function(e) {
    track.restart({animate: false});
    output("track.restart({animate: false})");
  });

  output("Console started... Interact with the buttons");
});
