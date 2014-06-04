$(function() {
  // =========================================================================
  // Our support functions, just for the example
  // =========================================================================

  // Let's create a function to create the urls for our "echo" test server
  var urlToEchoServer = function(track, page, perPage, type) {
    var jsonText = escape(JSON.stringify(fakeJsonCreator(page, perPage, type)));
    var echoServerHost = "http://echo-server.herokuapp.com";
    return echoServerHost + "/echo/json/" + page + "?json=" + jsonText + "&total_pages=5";
  }

  // Support function for our test
  var fakeJsonCreator = function(page, perPage, type) {
    var items = [];
    for (var i = 0; i < perPage; i++) {
      var index = perPage * (page - 1) + i
      items.push({img_url: "http://lorempixel.com/224/128/" + type + "/" + (index + 1)});
    }

    return items;
  }

  // =========================================================================
  // Track creation and plugin configuration
  // =========================================================================

  var container = $(".track.sample2");
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
    url: function(track, page, perPage) {
      return urlToEchoServer(track, page, perPage, "food"); // default type "food"
    },
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

  // =========================================================================
  // Content Selection
  // =========================================================================

  $(".commands button[data-type]").each(function() {
    var button = $(this);
    var type = button.data("type");

    button.off("click").click(function(e) {
      e.preventDefault();

      var plugin = track.findPluginByName("RemoteContent");
      plugin.options.url = function(track, page, perPage) {
        // URL with the selected type
        return urlToEchoServer(track, page, perPage, type);
      }

      plugin.reload();

      $(".commands button[data-type]").removeClass("active");
      button.addClass("active");
    });

  });
});
