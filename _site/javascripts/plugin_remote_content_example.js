$(function() {
  // =========================================================================
  // Our support functions, just for the example
  // =========================================================================

  // Let's create a function to create the urls for our "echo" test server
  var urlToEchoServer = function(track, page, perPage) {
    var jsonText = escape(JSON.stringify(fakeJsonCreator(page, perPage)));
    var echoServerHost = "http://echo-server.herokuapp.com";
    return echoServerHost + "/echo/json/" + page + "?json=" + jsonText + "&total_pages=5";
  }

  // Support function for our test
  var fakeJsonCreator = function(page, perPage) {
    var photoTypes = ["food", "people", "nature", "sports"];
    var items = [];
    for (var i = 0; i < perPage; i++) {
      items.push({img_url: "http://lorempixel.com/224/128/" + photoTypes[i]});
    }

    return items;
  }

  // =========================================================================
  // Track creation and plugin configuration
  // =========================================================================

  var container = $(".track:first");
  var track = container.find(".slider-container").silverTrack({
    easing: "easeInOutQuad",
    duration: 600
  });

  track.install(new SilverTrack.Plugins.Navigator({
    prev: $("a.prev", container),
    next: $("a.next", container)
  }));

  // Let's create our processor, the function that will transform the data
  // from the server into an array of DOM elements
  var processor = function(track, perPage, json) {
    var array = [];

    for (var i = 0; i < perPage; i++) {
      if (json.data[i] === undefined) {
        break;
      }

      array.push(
        $("<div></div>", {"class": "item"}).append($("<img>", {"src": json.data[i].img_url}))
      );
    }

    return array;
  }

  // Then we install the plugin
  track.install(new SilverTrack.Plugins.RemoteContent({
    url: urlToEchoServer,
    process: processor,

    beforeStart: function(track) {
      track.container.parent().append($("<div></div>", {"class": "loading"}));
    },

    beforeSend: function(track) {
      $(".loading", track.container.parent()).fadeIn();
    },

    beforeAppend: function(track, items) {
      $(".loading", track.container.parent()).hide();
    },

    updateTotalPages: function(track, json) {
      track.updateTotalPages(json.total_pages);
    }
  }));

  track.start();
});
