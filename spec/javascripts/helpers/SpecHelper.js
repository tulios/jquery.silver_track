beforeEach(function() {
  //this.addMatchers({
    //toBePlaying: function(expectedSong) {
      //var player = this.actual;
      //return player.currentlyPlayingSong === expectedSong && 
             //player.isPlaying;
    //}
  //});
});

var helpers = (function() {
  return {
    basic: function(params) {
      var opts = params ? params : {};
      return $("#basic").silverTrack(opts);
    },

    cover: function(params) {
      var opts = params ? $.extend({cover: true}, params) : {cover: true};
      return $("#cover").silverTrack(opts);
    },

    remote: function(params) {
      var opts = params ? params : {};
      return $("#remote").silverTrack(opts);
    },

    ajaxResponses: {
      onePage: {
        total_pages: 1,
        data: [
          {img_url: "http://lorempixel.com/224/128/food",   title: "Item 1"},
          {img_url: "http://lorempixel.com/224/128/people", title: "Item 2"},
          {img_url: "http://lorempixel.com/224/128/nature", title: "Item 3"},
          {img_url: "http://lorempixel.com/224/128/sports", title: "Item 4"}
        ]
      },

      multiplePages: {
        total_pages: 5,
        data: [
          {img_url: "http://lorempixel.com/224/128/food",   title: "Item 1"},
          {img_url: "http://lorempixel.com/224/128/people", title: "Item 2"},
          {img_url: "http://lorempixel.com/224/128/nature", title: "Item 3"},
          {img_url: "http://lorempixel.com/224/128/sports", title: "Item 4"}
        ]
      }
    },

    initResponsiveHub: function() {
      $.responsiveHub({
        layouts: {
          320: "phone",
          960: "web",
          768: "tablet"
        },
        defaultLayout: "web"
      });
    }
  };
})();
