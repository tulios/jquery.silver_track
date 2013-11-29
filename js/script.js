jQuery(function() {

  jQuery.support.cors = true;

  window.SilverTrackExample = {
    defaults: {easing: "easeInOutQuad", duration: 600},
    echoServerHost: "http://echo-server.herokuapp.com",
    urlAjax: function(opts) {
      var json = this.jsonCreator(opts.page, opts.perPage);
      return this.urlCreator(json, opts.page, opts.totalPages);
    },

    urlCreator: function(obj, page, totalPages) {
      var jsonText = escape(JSON.stringify(obj));
      return this.echoServerHost + "/echo/json/" + page + "?json=" + jsonText + "&total_pages=" + totalPages;
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
    $("a.reload", example.parents(".track")).click(function(e) {
      e.preventDefault();
      example.silverTrack().restart();
    });
  });

});
