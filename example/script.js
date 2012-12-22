jQuery(function() {

  window.SilverTrackExample = {
    urlAjax: function(opts) {
      var json = this.jsonCreator(opts.page, opts.perPage);
      return this.urlCreator(json, opts.page, opts.totalPages);
    },

    urlCreator: function(obj, page, totalPages) {
      var jsonText = encodeURIComponent(JSON.stringify(obj));
      return "http://localhost:4567/echo/json/" + page + "?json=" + jsonText + "&total_pages=" + totalPages;
    },

    jsonCreator: function(page, perPage) {
      var photoTypes = ["food", "people", "nature", "sports"];
      var items = [];
      for (var i = 0; i < perPage; i++) {
        items.push({
          img_url: "http://lorempixel.com/224/128/" + photoTypes[i],
          title: "Page " + page + " item  " + i
        });
      }

      return items;
    }
  }

  $(".slider-container").each(function() {
    var example = $(this);
    var hasCover = example.hasClass("big") || example.hasClass("huge");

    var track = example.silverTrack({cover: hasCover});
    track.install(new SilverTrack.Plugins.Navigator({
      prev: $("a.prev", example.parent().parent()),
      next: $("a.next", example.parent().parent())
    }));

    if (!example.hasClass("remote")) {
      track.install(new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", example.parent().parent())
      }));
    }

    if (example.hasClass("remote")) {
      track.install(new SilverTrack.Plugins.RemoteContent({
        url: function(page, perPage) {
          return SilverTrackExample.urlAjax({page: page, perPage: perPage, totalPages: 5})
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
    }

    track.start();

    $("a.reload", example.parent()).click(function(e) {
      e.preventDefault();
      track.restart();
    });
  });

});
