describe("SilverTrack.Recipes", function() {
  var element = null;
  var plugin = null;

  beforeEach(function() {
    $.fx.off = true;
    loadFixtures("basic.html");

    $.silverTrackPlugin("Generic", {});
    plugin = new SilverTrack.Plugins.Generic();

    SilverTrack.Recipes = {};

    $.silverTrackRecipes("basic", function(factory) {
      factory.createTrack($.noop);
    });

    $.silverTrackRecipes("complex", function(factory) {
      factory.createTrack(function(element, options) {
        return element.silverTrack({easing: "easeInOutQuad", duration: 600});
      });

      factory.installPlugins(function(track, options) {
        track.install(new SilverTrack.Plugins.Generic());
      });
    });

    element = $("#basic");
  });

  describe("$.silverTrackRecipes", function() {
    it("should register a new recipe", function() {
      expect(!!SilverTrack.Recipes["basic"]).toBe(true);
      expect(!!SilverTrack.Recipes["complex"]).toBe(true);
    });
  })

  describe("$.silverTrackRecipes.create", function() {
    it("should create a new track for the given recipe and element", function() {
      var track = $.silverTrackRecipes.create("basic", element);
      expect(track).toBeDefined();
      expect(track.container).toBe(element);
    });

    it("shoud create the track using the configurations on the recipe", function() {
      var track = $.silverTrackRecipes.create("complex", element);
      expect(track).toBeDefined();
      expect(track.container).toBe(element);
      expect(track.options.easing).toBe("easeInOutQuad");
      expect(track.options.duration).toBe(600);
      expect(track.plugins.length).toBe(1);
      expect(track.plugins[0].PluginName).toBe("Generic");
    });
  });

  describe("SilverTrack.Factory", function() {
    var factory, external, options;

    beforeEach(function() {
      options = {param: 1};
      factory = new SilverTrack.Factory(element, options);
    });

    describe("#create", function() {
      it("should call the config callback using the externalInterface as an argument", function() {
        spyOn(factory, "externalInterface").andCallThrough();
        factory.create(function(f) {
          expect(f).not.toBe(undefined);
          expect(f.createTrack).toBeDefined();
          expect(f.installPlugins).toBeDefined();
        });
        expect(factory.externalInterface).toHaveBeenCalled();
      });

      it("should return a track", function() {
        var track = factory.create(function(f) { f.installPlugins() });
        expect(track).not.toBe(null);
      });
    });

    describe("#externalInterface", function() {
      beforeEach(function() {
        external = factory.externalInterface();
      });

      it("should return an object that follows the external contract", function() {
        expect(external["createTrack"]).toBeDefined();
        expect(external["installPlugins"]).toBeDefined();
      });

      describe("#createTrack", function() {
        it("should pass element and options to callback", function() {
          external.createTrack(function(e, opts) {
            expect(e).toBe(element);
            expect(opts).not.toBe(undefined);
            expect(opts.param).toBe(options.param);
          });
        });

        it("should save the reference of track", function() {
          expect(factory.track).toBe(null);
          external.createTrack(function() { return 1 });
          expect(factory.track).toBe(1);
        });

        it("should create a new track if callback not provide one", function() {
          expect(factory.track).toBe(null);
          external.createTrack($.noop);
          expect(factory.track).not.toBe(null);
        });
      });

      describe("#installPlugins", function() {
        it("should pass track and options to callback", function() {
          external.createTrack($.noop);
          external.installPlugins(function(track, opts) {
            expect(track).not.toBe(null);
            expect(opts).not.toBe(undefined);
            expect(opts.param).toBe(options.param);
          });
        });

        it("should create a new track if does not exist", function() {
          expect(factory.track).toBe(null);
          external.installPlugins($.noop);
          expect(factory.track).not.toBe(null);
        });
      });
    });
  });
});
