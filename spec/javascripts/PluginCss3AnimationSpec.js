describe("SilverTrack.Plugins.Css3Animation", function() {
  var track = null;
  var plugin = null;
  var originalTransform , duration, easing, bezierMap;

  beforeEach(function() {
    loadFixtures("basic.html");

    $.fx.off = true;

    duration = 1;
    easing = "swing";
    bezierMap = SilverTrack.Plugins.Css3Animation.CubicBezierMap;

    track = helpers.basic({duration: duration, easing: easing});
  });

  beforeEach(function() {
    originalTransform = Modernizr.csstransforms3d;
  });

  afterEach(function() {
    Modernizr.csstransforms3d = originalTransform;
  });

  it("should map the cubic-bezier functions of easings", function() {
    expect(bezierMap).not.toBe(undefined);
  });

  it("should have defaults for each option", function() {
    plugin = new SilverTrack.Plugins.Css3Animation();

    expect(plugin.options.durationUnit).toBe("ms");
    expect(plugin.options.delayUnit).toBe(null);

    expect(plugin.options.slideDelay).toBe(0);
    expect(plugin.options.autoHeightDuration).toBe(null);
    expect(plugin.options.autoHeightEasing).toBe(null);
    expect(plugin.options.autoHeightDelay).toBe(null);

    expect(plugin.options.setupParent).toBe(true);
    expect(plugin.options.setupTransitionProperty).toBe(true);
    expect(plugin.options.setupTransitionDuration).toBe(true);
    expect(plugin.options.setupTransitionTimingFunction).toBe(true);
    expect(plugin.options.setupTransitionDelay).toBe(true);
  });

  describe("initialization", function() {
    it("should disable fallback if the browser supports transform3d", function() {
      Modernizr.csstransforms3d = true;
      plugin = new SilverTrack.Plugins.Css3Animation();
      expect(plugin.fallback).toBe(false);
    });

    it("should enable fallback if the browser does not support transform3d", function() {
      Modernizr.csstransforms3d = false;
      plugin = new SilverTrack.Plugins.Css3Animation();
      expect(plugin.fallback).toBe(true);
    });

    it("should be able to change defaults", function() {
      plugin = new SilverTrack.Plugins.Css3Animation({
        durationUnit: "s",
        delayUnit: "ms",

        slideDelay: 1,
        autoHeightDuration: 100,
        autoHeightEasing: "easeInOut",
        autoHeightDelay: 2,

        setupParent: false,
        setupTransitionProperty: false,
        setupTransitionDuration: false,
        setupTransitionTimingFunction: false
      });

      expect(plugin.options.durationUnit).toBe("s");
      expect(plugin.options.delayUnit).toBe("ms");

      expect(plugin.options.slideDelay).toBe(1);
      expect(plugin.options.autoHeightDuration).toBe(100);
      expect(plugin.options.autoHeightEasing).toBe("easeInOut");
      expect(plugin.options.autoHeightDelay).toBe(2);

      expect(plugin.options.setupParent).toBe(false);
      expect(plugin.options.setupTransitionProperty).toBe(false);
      expect(plugin.options.setupTransitionDuration).toBe(false);
      expect(plugin.options.setupTransitionTimingFunction).toBe(false);
    });
  });

  describe("on install", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.Css3Animation();
    });

    it("should keep a reference of track", function() {
      track.install(plugin);
      expect(plugin.track).toBe(track);
    });

    describe("when fallback is disabled", function() {
      beforeEach(function() {
        plugin.fallback = false;
      });

      it("should replace track 'animateFunction' with one that calls 'cssAnimate' repassing the parameters", function() {
        spyOn(plugin, "cssAnimate");
        track.install(plugin);
        track.options.animateFunction(1, 2, 3, 4);
        expect(plugin.cssAnimate).toHaveBeenCalledWith(1, 2, 3, 4);
      });
    });

    describe("when fallback is enabled", function() {
      beforeEach(function() {
        plugin.fallback = true;
      });

      it("should keep $.fn.animate as the main animation function", function() {
        spyOn(plugin, "cssAnimate");
        spyOn($.fn, "animate");
        track.install(plugin);
        track.start();
        track.goToPage(2);
        expect(plugin.cssAnimate).not.toHaveBeenCalled();
        expect($.fn.animate).toHaveBeenCalled();
      });
    });
  });

  describe("before start", function() {
    var style;

    beforeEach(function() {
      plugin = new SilverTrack.Plugins.Css3Animation();
      plugin.fallback = false;
      track.install(plugin);
      track.start();

      style = track.container.attr("style");
    });

    it("should apply transform3d(0px, 0px, 0px) to parent container to enable hardware acceleration", function() {
      var parentContainerStyle = track.container.parent().attr("style");
      expect(parentContainerStyle).toMatch(new RegExp("transform: translate3d\\(0px, 0px, 0px\\)"));
    });

    it("should configure the animation duration in ms, the timing function in cubic-bezier and property with transform", function() {
      var easingRegex = bezierMap[easing].replace("(", "\\(").replace(")", "\\)");
      expect(style).toMatch(new RegExp("transition: -(moz|webkit)-transform " + duration + "ms " + easingRegex));
    });
  });

  describe("cssAnimate", function() {
    var animated, timeout, args;

    beforeEach(function() {
      animated = false;

      args = {
        movement: {left: "-50px"},
        duration: duration,
        easing: easing,
        afterCallback: $.noop
      };

      spyOn(args, "afterCallback");

      plugin = new SilverTrack.Plugins.Css3Animation();
      plugin.fallback = false;
      track.install(plugin);
      track.start();
    });

    it("should call afterCallback after css animation", function() {
      plugin.cssAnimate(args.movement, args.duration, args.easing, args.afterCallback);

      runs(function() {
        setTimeout(function() { animated = true }, 10);
      });

      waitsFor(function() { return animated }, "the css3 animation end", 700);

      runs(function() {
        expect(args.afterCallback).toHaveBeenCalled();
      });
    });

    it("should apply the movement with translate3d", function() {
      plugin.cssAnimate(args.movement, args.duration, args.easing, args.afterCallback);
      var style = track.container.attr("style");
      expect(style).toMatch(new RegExp("transform: translate3d\\(" + args.movement.left + ", 0px, 0px\\)"));
    });
  });

});
