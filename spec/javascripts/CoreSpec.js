describe("SilverTrack", function() {

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");
    $.fx.off = true;
  });

  describe("Plugin initialization", function() {

    it("should use default values", function() {
      var track = $("#basic").silverTrack();

      expect(track.opts.perPage).toBe(4);
      expect(track.opts.itemClass).toBe("item");
      expect(track.opts.cover).toBe(false);
    });

  });

});
