//=================================================
// Example 4 - remote content
//=================================================

jQuery(function() {

  var example = $("#example-4");
  var track = example.silverTrack();

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", example.parent().parent()),
    next: $("a.next", example.parent().parent())
  }));

  track.install(new SilverTrack.Plugins.BulletNavigator({
    container: $(".bullet-pagination", example.parent().parent())
  }));

  track.install(new SilverTrack.Plugins.RemoteContent({
    url: function(page, perPage) {
      return SilverTrackExample.urlAjax({page: page, perPage: perPage, totalPages: 5})
    },
    beforeStart: function(track) {
      track.container.append($("<div></div>", {"class": "loading"}));
    },
    beforeSend: function(track) {
      $(".loading", track.container).fadeIn();
    },
    beforeAppend: function(track) {
      $(".loading", track.container).fadeOut();
    },
    process: function(track, perPage, json) {
      var data = json.data;
      var array = [];

      for (var i = 0; i < perPage; i++) {
        array.push(
          $("<div></div>", {"class": "item"}).
          append($("<img>", {"src": data[i].img_url})).
          append($("<p></p>", {"text": data[i].title}))
        );
      }

      return array;
    },

    updateTotalPages: function(track, json) {
      track.updateTotalPages(json.total_pages);
    }
  }));

  track.start();

});
