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
    var photoTypes = [
      ["abstract", "city"],
      ["people", "transport"],
      ["animals", "food"],
      ["nature", "business"],
      ["nightlife", "sports"]
    ];

    var items = [];
    var types = photoTypes[page - 1];
    for (var i = 0; i < perPage; i++) {
      items.push({img_url: "http://lorempixel.com/224/128/" + types[i]});
    }

    return items;
  }

  // =========================================================================
  // Track creation and plugin configuration
  // =========================================================================

  var container = $(".track.sample3");
  var track = container.find(".slider-container").silverTrack({
    easing: "easeInOutQuad",
    duration: 600,
    perPage: 2
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
    prefetchPages: 2,

    beforeStart: function(track) {
      track.container.parent().append($("<div></div>", {"class": "loading"}));
    },

    beforeSend: function(track, jqXHR, settings, opts) {
      if (opts.prefetch) {
        return;
      }

      $(".loading", track.container.parent()).fadeIn();
    },

    beforeAppend: function(track, items, opts) {
      if (!!opts.prefetch) {
        return;
      }

      $(".loading", track.container.parent()).hide();
    },

    updateTotalPages: function(track, json) {
      track.updateTotalPages(json.total_pages);
    }
  }));

  track.start();
});
