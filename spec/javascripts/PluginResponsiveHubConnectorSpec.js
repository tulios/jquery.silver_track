describe("SilverTrack.Plugins.ResponsiveHubConnector", function() {
  var track = null;
  var plugin = null;
  var createPlugin = function() {
    return new SilverTrack.Plugins.ResponsiveHubConnector({
      layouts: ["phone", "small-tablet", "tablet", "web"],
      onReady: function(track, options, event) {},
      onChange: function(track, options, event) {}
    });
  };

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");

    $.fx.off = true;

    track = helpers.basic();
  });

  describe("enabled", function() {
    it("should be true if $.responsiveHub exists", function() {
      expect($.responsiveHub).toBeDefined();
      expect(createPlugin().enabled).toBe(true);
    });

    it("should be false if $.responsiveHub does no exist", function() {
      var aux = $.responsiveHub;
      delete $.responsiveHub;
      expect($.responsiveHub).not.toBeDefined();
      expect(createPlugin().enabled).toBe(false);
      $.responsiveHub = aux;
    });
  });

  describe("onReady", function() {
    beforeEach(function() {
      plugin = createPlugin();
      track.install(plugin);
    });

    it("should call 'onReady' when responsiveHub fire the 'ready' event", function() {
      spyOn(plugin.options, "onReady");
      spyOn($.responsiveHub("self"), "width").andReturn(800);
      helpers.initResponsiveHub();

      var event = {layout: "tablet", touch: false};
      expect(plugin.options.onReady).toHaveBeenCalledWith(track, plugin.options, event);
    });
  });

  describe("onChange", function() {
    beforeEach(function() {
      plugin = createPlugin();
      track.install(plugin);
    });

    it("should call 'onChange' when responsiveHub fire the 'change' event", function() {
      helpers.initResponsiveHub();

      spyOn(plugin.options, "onChange");
      $.responsiveHub("self").currentLayout = null;
      spyOn($.responsiveHub("self"), "width").andReturn(800);
      $.responsiveHub("self")._updateLayout();

      var event = {layout: "tablet", touch: false};
      expect(plugin.options.onChange).toHaveBeenCalledWith(track, plugin.options, event);
    });
  });
});
