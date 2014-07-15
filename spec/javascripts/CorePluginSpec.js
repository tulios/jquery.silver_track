describe("$.silverTrackPlugin", function() {
  var plugin = null;

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");

    $.fx.off = true;
  });

  it("should register the new plugin into SilverTrack.Plugins", function() {
    $.silverTrackPlugin("NewPlugin", {});
    expect(SilverTrack.Plugins["NewPlugin"]).toBeDefined();
  });

  it("should merge defaults and pass to initialize", function() {
    $.silverTrackPlugin("NewPlugin", {
      defaults: { attr: 1 },
      initialize: function(options) {
        expect(options).toBeDefined();
        expect(options.attr).toBe(1);
      }
    });
    new SilverTrack.Plugins.NewPlugin();
  });

  it("should store the plugin name into PluginName", function() {
    $.silverTrackPlugin("NewPlugin", {});
    expect(new SilverTrack.Plugins.NewPlugin().PluginName).toBe("NewPlugin");
  });

  describe("about callbacks", function() {
    beforeEach(function() {
      $.silverTrackPlugin("NewPlugin", {});
      plugin = new SilverTrack.Plugins.NewPlugin();
    });

    it("should define 'initialize'", function() {
      expect(plugin.initialize).toBeDefined();
    });

    it("should define 'onInstall'", function() {
      expect(plugin.onInstall).toBeDefined();
    });

    it("should define 'beforeStart'", function() {
      expect(plugin.beforeStart).toBeDefined();
    });

    it("should define 'afterStart'", function() {
      expect(plugin.afterStart).toBeDefined();
    });

    it("should define 'beforeRestart'", function() {
      expect(plugin.beforeRestart).toBeDefined();
    });

    it("should define 'afterRestart'", function() {
      expect(plugin.afterRestart).toBeDefined();
    });

    it("should define 'beforeAnimation'", function() {
      expect(plugin.beforeAnimation).toBeDefined();
    });

    it("should define 'afterAnimation'", function() {
      expect(plugin.afterAnimation).toBeDefined();
    });

    it("should define 'beforePagination'", function() {
      expect(plugin.beforePagination).toBeDefined();
    });

    it("should define 'onTotalPagesUpdate'", function() {
      expect(plugin.onTotalPagesUpdate).toBeDefined();
    });

    it("should define 'beforeAdjustHeight'", function() {
      expect(plugin.beforeAdjustHeight).toBeDefined();
    });

    it("should define 'afterAdjustHeight'", function() {
      expect(plugin.afterAdjustHeight).toBeDefined();
    });
  });
});
