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
      expect(style).toMatch(new RegExp("transition: (-(moz|webkit)-)?transform " + duration + "ms " + easingRegex));
    });
  });

  describe("afterRestart", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.Css3Animation();
      plugin.fallback = false;
      track.install(plugin);
      track.start();

      spyOn(plugin, "_setupTransition");
    });

    it("should setup the transition again", function() {
      track.restart();
      expect(plugin._setupTransition).toHaveBeenCalled();
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

    describe("with movement on left", function() {
      it("should apply the movement with translate3d", function() {
        plugin.cssAnimate(args.movement, args.duration, args.easing, args.afterCallback);
        var style = track.container.attr("style");
        expect(style).toMatch(new RegExp("transform: translate3d\\(" + args.movement.left + ", 0px, 0px\\)"));
      });
    });

    describe("with movement on top", function() {
      beforeEach(function() {
        args.movement = {top: "-80px"};
      });

      it("should apply the movement with translate3d", function() {
        plugin.cssAnimate(args.movement, args.duration, args.easing, args.afterCallback);
        var style = track.container.attr("style");
        expect(style).toMatch(new RegExp("transform: translate3d\\(0px, " + args.movement.top + ", 0px\\)"));
      });
    });
  });

  describe("_cleanElementTransition", function() {
    it("should clean transition css value", function() {
      plugin._cleanElementTransition();
      var style = track.container.attr("style");
      expect(style).not.toMatch(new RegExp("transition"))
    });
  });

  describe("_setupTransition", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.Css3Animation();
      plugin.fallback = false;
      track.install(plugin);
    });

    describe("setupParent", function() {
      describe("enabled", function() {
        it("should apply transform3d with left 0 in the container parent", function() {
          spyOn(plugin, "_applyTransform3d");
          plugin._setupTransition();
          expect(plugin._applyTransform3d).toHaveBeenCalledWith(track.container.parent(), {left: 0});
        });
      });

      describe("disabled", function() {
        beforeEach(function() { plugin.options.setupParent = false });

        it("should do nothing", function() {
          spyOn(plugin, "_applyTransform3d");
          plugin._setupTransition();
          expect(plugin._applyTransform3d).not.toHaveBeenCalled();
        })
      });
    });

    describe("setupTransitionProperty", function() {
      describe("enabled", function() {
        describe("autoHeight false", function() {
          it("should set the transition property to transform", function() {
            plugin._setupTransition();
            expect(track.container.css("transition-property")).toMatch(/transform/);
          });
        });

        describe("autoHeight true", function() {
          beforeEach(function() { track.options.autoHeight = true });

          it("should set the transition property to transform, height", function() {
            plugin._setupTransition();
            expect(track.container.css("transition-property")).toMatch(/transform, height/);
          });
        });
      });

      describe("disabled", function() {
        beforeEach(function() { plugin.options.setupTransitionProperty = false });

        it("should do nothing", function() {
          plugin._setupTransition();
          expect(track.container.css("transition-property")).toBe("all");
        });
      });
    });

    describe("setupTransitionDuration", function() {
      beforeEach(function() { plugin.options.durationUnit = "s" });

      describe("enabled", function() {
        describe("autoHeight false", function() {
          it("should set the transition duration property to the configured value", function() {
            plugin._setupTransition();
            var duration = plugin._toDuration(track.options.duration);
            expect(track.container.css("transition-duration")).toMatch(new RegExp(duration));
          });
        });

        describe("autoHeight true", function() {
          beforeEach(function() { track.options.autoHeight = true });

          it("should set the transition duration property including the duration for autoHeight", function() {
            plugin.options.autoHeightDuration = 2;
            plugin._setupTransition();

            var duration = plugin._toDuration(track.options.duration);
            var autoHeightDuration = plugin._toDuration(plugin.options.autoHeightDuration);
            expect(track.container.css("transition-duration")).toMatch(new RegExp(duration + ", " + autoHeightDuration));
          });

          it("should fallback to duration if autoHeightDuration is null", function() {
            plugin.options.autoHeightDuration = null;
            plugin._setupTransition();
            var duration = plugin._toDuration(track.options.duration);
            expect(track.container.css("transition-duration")).toMatch(new RegExp(duration + ", " + duration));
          });
        });
      });

      describe("disabled", function() {
        beforeEach(function() { plugin.options.setupTransitionDuration = false });

        it("should do nothing", function() {
          plugin._setupTransition();
          expect(track.container.css("transition-duration")).toBe("0s");
        });
      });
    });

    describe("setupTransitionTimingFunction", function() {
      describe("enabled", function() {
        describe("autoHeight false", function() {
          it("should set the transition timing function property to the configured value", function() {
            plugin._setupTransition();
            var easing = plugin._easingFunctionToCubicBezier(track.options.easing);
            expect(track.container.css("transition-timing-function")).toEqual(easing);
          });
        });

        describe("autoHeight true", function() {
          beforeEach(function() { track.options.autoHeight = true });

          it("should set the transition timing function property including the configured for autoHeight", function() {
            plugin.options.autoHeightEasing = "easeInQuad";
            plugin._setupTransition();

            var easing = plugin._easingFunctionToCubicBezier(track.options.easing);
            var autoHeightEasing = plugin._easingFunctionToCubicBezier(plugin.options.autoHeightEasing);
            expect(track.container.css("transition-timing-function")).toEqual(easing + ", " + autoHeightEasing);
          });

          it("should fallback to easing if autoHeightEasing is null", function() {
            plugin.options.autoHeightEasing = null;
            plugin._setupTransition();
            var easing = plugin._easingFunctionToCubicBezier(track.options.easing);
            expect(track.container.css("transition-timing-function")).toEqual(easing + ", " + easing);
          });
        });
      });

      describe("disabled", function() {
        beforeEach(function() { plugin.options.setupTransitionTimingFunction = false });

        it("should do nothing", function() {
          plugin._setupTransition();
          expect(track.container.css("transition-timing-function")).toBe("ease");
        });
      });
    });

    describe("setupTransitionDelay", function() {
      beforeEach(function() {
        plugin.options.durationUnit = "s";
        plugin.options.slideDelay = 2;
      });

      describe("enabled", function() {
        describe("autoHeight false", function() {
          it("should set the transition timing function property to the configured value", function() {
            plugin._setupTransition();
            var delay = plugin._toDelay(plugin.options.slideDelay);
            expect(track.container.css("transition-delay")).toMatch(new RegExp(delay));
          });
        });

        describe("autoHeight true", function() {
          beforeEach(function() { track.options.autoHeight = true });

          it("should set the transition delay property including the configured for autoHeight", function() {
            plugin.options.autoHeightDelay = 3;
            plugin._setupTransition();

            var delay = plugin._toDelay(plugin.options.slideDelay);
            var autoHeightDelay = plugin._toDelay(plugin.options.autoHeightDelay);
            expect(track.container.css("transition-delay")).toMatch(new RegExp(delay + ", " + autoHeightDelay));
          });

          it("should fallback to slideDelay if autoHeightEasing is null", function() {
            plugin.options.autoHeightDelay = null;
            plugin._setupTransition();

            var delay = plugin._toDelay(plugin.options.slideDelay);
            expect(track.container.css("transition-delay")).toMatch(new RegExp(delay + ", " + delay));
          });
        });
      });

      describe("disabled", function() {
        beforeEach(function() { plugin.options.setupTransitionDelay = false });

        it("should do nothing", function() {
          plugin._setupTransition();
          expect(track.container.css("transition-delay")).toBe("0s");
        });
      });
    });
  });

  describe("when track is restarted with 'animate' false", function() {
    beforeEach(function() {
      animated = false;

      args = {
        movement: {left: "-50px"},
        duration: 0,
        easing: easing,
        afterCallback: $.noop
      };

      spyOn(args, "afterCallback");
      plugin = new SilverTrack.Plugins.Css3Animation();
      plugin.fallback = false;
      track.install(plugin);
      track.start();
    });

    describe("cssAnimate", function() {
      it("should call '_setupTransition'", function() {
        spyOn(plugin, "_getTransitionEndEvent");
        spyOn(plugin, "_setupTransition");
        plugin.cssAnimate(args.movement, args.duration, args.easing, args.afterCallback);

        expect(plugin._setupTransition).toHaveBeenCalledWith(args.duration);
      });
    });

    describe("_setupTransition", function() {
      it("should setup 'transition-duration' eql zero", function() {
        plugin._setupTransition(duration);
        expect(track.container.css("transition-duration")).toMatch(new RegExp(duration));
      });

      it("should call 'clean-element-transition", function() {
        spyOn(plugin, "_cleanElementTransition");
        plugin._setupTransition(args.duration);
        expect(plugin._cleanElementTransition).toHaveBeenCalled();
      });
    });
  });
});