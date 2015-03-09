describe("SilverTrack.Plugins.CircularNavigator", function() {
  var getBullets = function(plugin, track) {
    return $(".bullet-pagination ." + plugin.options.bulletClass, track.container.parent());
  }
  var track = null;
  var circularPlugin = null;
  var navigatorPlugin = null;
  function sharedBehaviorForPage(params, behaviorFunction) {
    describe("(shared)", function() {

      beforeEach(function() {
        loadFixtures("basic.html");
        $.fx.off = true;
        track = helpers.basic();

        circularPlugin = new SilverTrack.Plugins.CircularNavigator();
        navigatorPlugin = new SilverTrack.Plugins.Navigator({
          prev: $("a.prev", track.container.parent().parent()),
          next: $("a.next", track.container.parent().parent())
        });
        bulletPlugin = new SilverTrack.Plugins.BulletNavigator({
          container: $(".bullet-pagination", track.container.parent())
        });

        track.install(bulletPlugin);
        track.install(navigatorPlugin);
        track.install(circularPlugin);

        track.start();

        hasPrev = params.hasPrev;
        hasNext = params.hasNext;
        currentPage = params.currentPage;
        totalPages = params.totalPages;

        if (behaviorFunction) behaviorFunction();
      });

      it("should starts with 'next' and 'prev' buttons activated", function() {
        prevButton = $(".prev");
        nextButton = $(".next");

        expect(prevButton).not.toHaveClass("disabled");
        expect(nextButton).not.toHaveClass("disabled");
      });

      it("should bring currentPage up to date", function() {
        expect(track.currentPage).toEqual(currentPage);
      });

      it("should bring total pages up to date", function() {
        expect(track.totalPages).toEqual(totalPages);
      });

      it("should bring up if have previous page", function() {
        expect(track.hasPrev()).toEqual(hasPrev);
      });

      it("should bring up if have previous page", function() {
        expect(track.hasNext()).toEqual(hasNext);
      });
    });
  };

  describe("starting", function() {
    var params = {
      hasPrev: false,
      hasNext: true,
      currentPage: 1,
      totalPages: 3,
    }

    sharedBehaviorForPage(params);

    describe("when previous button is clicked (third page)", function() {
      var params = {
        hasPrev: true,
        hasNext: true,
        currentPage: 3,
        totalPages: 4,
      }

      sharedBehaviorForPage(params, function() {
        $(".prev").click();
      });

      describe(", and back button is clicked again (second page)", function() {
        var params = {
          hasPrev: true,
          hasNext: true,
          currentPage: 2,
          totalPages: 4,
        }

        sharedBehaviorForPage(params, function() {
          $(".prev").click();
          track.prev();
        });
      });

      describe(", and next is button clicked again (first page)", function() {
        var params = {
          hasPrev: false,
          hasNext: true,
          currentPage: 1,
          totalPages: 3,
        }

        sharedBehaviorForPage(params, function() {
          $(".prev").click();
          track.next();
        });
      });
    });

    describe("when the next button is clicked (second page)", function() {
      var params = {
        hasPrev: true,
        hasNext: true,
        currentPage: 2,
        totalPages: 4,
      }

      sharedBehaviorForPage(params, function() {
        track.next()
      });

      describe(", and back button is clicked (first page)", function() {
        var params = {
          hasPrev: false,
          hasNext: true,
          currentPage: 1,
          totalPages: 3,
        }

        sharedBehaviorForPage(params, function() {
          track.prev();
        });        
      });

      describe(", and next button is clicked (third Page)", function() {
        var params = {
          hasPrev: true,
          hasNext: true,
          currentPage: 3,
          totalPages: 4,
        }
        
        sharedBehaviorForPage(params, function() {
          track.next();
          track.next();
        });

        describe(", and next button is clicked (first page)", function() {
          var params = {
            hasPrev: false,
            hasNext: true,
            currentPage: 1,
            totalPages: 3,
          }
          
          sharedBehaviorForPage(params, function() {
            track.next();
            track.next();
            track.next();
          });
        });
      });
    });
  });

  describe("method tests", function() {
    beforeEach(function() {
      loadFixtures("basic.html");
      $.fx.off = true;
      track = helpers.basic();

      circularPlugin = new SilverTrack.Plugins.CircularNavigator();
      navigatorPlugin = new SilverTrack.Plugins.Navigator({
        prev: $("a.prev", track.container.parent().parent()),
        next: $("a.next", track.container.parent().parent())
      });

      track.install(navigatorPlugin);
      track.install(circularPlugin);

      track.start();
    });

    describe("#initialize", function() {
      it("should setup track options", function () {
        var options = {};
        circularPlugin.initialize(options);
        expect(circularPlugin.options).toEqual(options);
      });
    });

    describe("#onInstall", function() {
      it("should setup track", function() {
        circularPlugin.onInstall(track);
        expect(circularPlugin.track).toEqual(track);
      });
    });
  });

  describe("when the autoPlay option is true", function() {
    beforeEach(function() {
      loadFixtures("basic.html");
      $.fx.off = true;
      track = helpers.basic();
      circularPlugin = new SilverTrack.Plugins.CircularNavigator({autoPlay: true, duration: 200});
      navigatorPlugin = new SilverTrack.Plugins.Navigator({
        prev: $("a.prev", track.container.parent().parent()),
        next: $("a.next", track.container.parent().parent())
      });
      bulletPlugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(navigatorPlugin);
      track.install(circularPlugin);
      track.install(bulletPlugin);

      track.start();
    });
  
    it("autoPlay options should be true", function() {
      expect(circularPlugin.options.autoPlay).toEqual(true);
    });

    it("should call next 1 time", function() {
      waitsFor(function() { if (track.currentPage === 2) return true }, "change the current page", 300);

      runs(function() {
        bullets = getBullets(bulletPlugin, track);
        var bullet = $(bullets[1]);
        expect(track.currentPage).toEqual(2);
        expect(bullet.hasClass(bulletPlugin.options.activeClass)).toBe(true);
      })
    });

    it("should call next 2 times", function() {
      waitsFor(function() { if (track.currentPage === 3) return true }, "change the current page", 550);

      runs(function() {
        bullets = getBullets(bulletPlugin, track);
        var bullet = $(bullets[2]);
        expect(track.currentPage).toEqual(3);
        expect(bullet.hasClass(bulletPlugin.options.activeClass)).toBe(true);
      })
    });

    it("should call next 3 times", function() {
      waitsFor(function() { if (track.currentPage === 1) return true }, "change the current page", 700);

      runs(function() {
        bullets = getBullets(bulletPlugin, track);
        var bullet = $(bullets[0]);
        expect(track.currentPage).toEqual(1);
        expect(bullet.hasClass(bulletPlugin.options.activeClass)).toBe(true);
      })
    });
  });

  describe("when bullet plugin is installed", function() {
    var getBullets = function(plugin, track) {
      return $(".bullet-pagination ." + plugin.options.bulletClass, track.container.parent());
    }
    beforeEach(function() {
      loadFixtures("basic.html");
      $.fx.off = true;
      track = helpers.basic();

      circularPlugin = new SilverTrack.Plugins.CircularNavigator();
      navigatorPlugin = new SilverTrack.Plugins.Navigator({
        prev: $("a.prev", track.container.parent().parent()),
        next: $("a.next", track.container.parent().parent())
      });
      bulletPlugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(navigatorPlugin);
      track.install(circularPlugin);
      track.install(bulletPlugin);
      track.start();

      bullets = getBullets(bulletPlugin, track);
    });

    it("should create the bullets based on totalPages", function() {
      expect(bullets.length).toBe(track.totalPages);
    });

    it("should setup bullet click on start", function() {
      spyOn(circularPlugin, "_setupBulletClick");
      track.start()
      expect(circularPlugin._setupBulletClick).toHaveBeenCalled();
    });

    describe("on click", function() {
      describe("at the first bullet", function() {
        beforeEach(function() {
          bullet = $(bullets[0])
        });

        it("should call restart", function() {
          spyOn(track, "restart")
          bullet.click();
          expect(track.restart).toHaveBeenCalled();
        });

        it("should try to append a new cloned page", function(){
          spyOn(circularPlugin, "_appendItems")
          bullet.click();
          expect(circularPlugin._appendItems).toHaveBeenCalled();
        });

        it("should remove last bullet", function() {
          spyOn(circularPlugin, "_removeLastBullet")
          bullet.click();
          expect(circularPlugin._removeLastBullet).toHaveBeenCalled();
        });

        it("shoud keep total bullets equal default totalPages after append cloned page", function() {
          var initialBullets = bullets.length;
          bullet.click();
          track.restart();
          var bulletsAfterClick = getBullets(bulletPlugin, track).length;
          expect(initialBullets).toEqual(bulletsAfterClick);
        });
      });

      describe("at a page who needs to be refreshed to show cloned items", function() {
        beforeEach(function() {
          bullet = $(bullets[2])
        });

        it("should update total pages after animate", function() {
          var initialTotalPages = track.totalPages;
          bullet.click();
          expect(track.currentPage).toEqual(3);
          expect(track.totalPages).not.toEqual(initialTotalPages);
        });

        it("shoud keep total bullets equal default totalPages after append cloned page", function() {
          var initialBullets = bullets.length;
          bullet.click();
          track.restart();
          var bulletsAfterClick = getBullets(bulletPlugin, track).length;
          expect(initialBullets).toEqual(bulletsAfterClick);
        });

        it("should change the current page", function() {
          spyOn(track, "restart");
          bullet.click();
          expect(track.restart).toHaveBeenCalledWith({keepCurrentPage: true, animate: true});
          expect(track.currentPage).toEqual(3);
        });
      });
    });
  });
});
