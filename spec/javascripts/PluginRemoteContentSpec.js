describe("SilverTrack.Plugins.RemoteContent", function() {
  var request = null;
  var track = null;
  var plugin = null;

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("remote.html");
    jasmine.Ajax.useMock();

    $.fx.off = true;
    track = helpers.remote();
  });

  describe("defaults", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.RemoteContent();
    });

    it("should have a default 'lazy'", function() {
      expect(plugin.options.lazy).toBe(true);
    });

    it("should have a default 'type'", function() {
      expect(plugin.options.type).toBe("GET");
    });

    it("should have a default 'params'", function() {
      expect(plugin.options.params).toBeDefined();
    });

    it("should have a default 'beforeStart'", function() {
      expect(plugin.options.beforeStart).toBeDefined();
    });

    it("should have a default 'beforeSend'", function() {
      expect(plugin.options.beforeSend).toBeDefined();
    });

    it("should have a default 'beforeAppend'", function() {
      expect(plugin.options.beforeAppend).toBeDefined();
    });

    it("should have a default 'process'", function() {
      expect(plugin.options.process).toBeDefined();
    });

    it("should have a default 'updateTotalPages'", function() {
      expect(plugin.options.updateTotalPages).toBeDefined();
    });

    it("should have a default 'onError'", function() {
      expect(plugin.options.onError).toBeDefined();
    });
  });

  describe("Initialization", function() {
    describe("when lazy true", function() {
      beforeEach(function() {
        plugin = new SilverTrack.Plugins.RemoteContent({
          url: "some/url/{page}"
        });
      });

      it("should call 'beforeStart' with an instance of the track", function() {
        spyOn(plugin.options, "beforeStart").andCallThrough();

        track.install(plugin);
        track.start();

        expect(plugin.options.beforeStart).toHaveBeenCalledWith(track);
      });

      it("should load the currentPage", function() {
        expect(track.currentPage).toBe(1);
        spyOn($, "ajax");

        track.install(plugin);
        track.start();
        expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("some/url/" + track.currentPage);
      });

      it("should restart the track", function() {
        spyOn($, "ajax").andCallFake(function(e) {
          e.success(helpers.ajaxResponses.onePage);
        });

        spyOn(track, "restart");
        track.install(plugin);
        track.start();
        expect(track.restart).toHaveBeenCalled();
      });
    });

    describe("when lazy false", function() {
      beforeEach(function() {
        plugin = new SilverTrack.Plugins.RemoteContent({
          lazy: false,
          url: "some/url/{page}"
        });
      });

      it("should call 'beforeStart' with an instance of the track", function() {
        spyOn(plugin.options, "beforeStart").andCallThrough();

        track.install(plugin);
        track.start();

        expect(plugin.options.beforeStart).toHaveBeenCalledWith(track);
      });

      it("should not load any content", function() {
        expect(track.currentPage).toBe(1);
        spyOn($, "ajax");

        track.install(plugin);
        track.start();
        expect($.ajax).not.toHaveBeenCalled();
      });
    });
  });

});
