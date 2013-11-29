//=================================================
// Example 4 - remote content
//=================================================

jQuery(function() {

  var example = $("#example-4");
  var parent = example.parents(".track");
  var track = example.silverTrack(SilverTrackExample.defaults);

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", parent),
    next: $("a.next", parent)
  }));

  track.install(new SilverTrack.Plugins.BulletNavigator({
    container: $(".bullet-pagination", parent)
  }));

  track.install(new SilverTrack.Plugins.RemoteContent({
    url: function(track, page, perPage) {
      return SilverTrackExample.urlAjax({page: page, perPage: perPage, totalPages: 5})
    },
    beforeStart: function(track) {
      track.container.parent().append($("<div></div>", {"class": "loading"}));
    },
    beforeSend: function(track) {
      $(".loading", track.container.parent()).fadeIn();
    },
    process: function(track, perPage, json) {
      var data = json.data;
      var array = [];

      for (var i = 0; i < perPage; i++) {
        if (data[i] === undefined) {
          break;
        }

        array.push(
          $("<div></div>", {"class": "item"}).
          append($("<img>", {"src": data[i].img_url})).
          append($("<p></p>", {"text": data[i].title}))
        );
      }

      return array;
    },

    beforeAppend: function(track, items) {
      $(".loading", track.container.parent()).hide();
    },

    updateTotalPages: function(track, json) {
      track.updateTotalPages(json.total_pages);
    }
  }));

  track.install(new SilverTrack.Plugins.ResponsiveHubConnector({
    layouts: ["phone", "small-tablet", "tablet", "web"],
    onReady: function(track, options, event) {
      options.onChange(track, options, event);
    },

    onChange: function(track, options, event) {
      track.options.mode = "horizontal";
      track.options.autoHeight = false;
      track.options.perPage = 4;

      if (event.layout === "small-tablet" || event.layout === "phone") {
        track.options.mode = "vertical";
        track.options.autoHeight = true;
      }

      track.restart({keepCurrentPage: true});
    }
  }));

  track.start();

});
