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
    }
  };
})();
