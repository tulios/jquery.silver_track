describe("SilverTrack.Plugins.CircularNavigator", function() {
  var track = null;
  var circularPlugin = null;
  var navigatorPlugin = null;
  function sharedBehaviorForPage(params, behaviorFunction) {
    describe("(shared)", function() {

      beforeEach(function() {
        loadFixtures("basic.html");
        $.fx.off = true;
        track = helpers.basic();

        circularPlugin = new SilverTrack.Plugins.CircularNavigator({autoPlay: false});
        navigatorPlugin = new SilverTrack.Plugins.Navigator({
          prev: $("a.prev", track.container.parent().parent()),
          next: $("a.next", track.container.parent().parent())
        });

        track.install(navigatorPlugin);
        track.install(circularPlugin);

        track.start();

        hasPrev = params.hasPrev;
        hasNext = params.hasNext;
        currentPage = params.currentPage;
        totalPages = params.totalPages;
        goLeft = params.goingLeft;

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

      it("should set 'goingLeft' false", function() {
        expect(circularPlugin.goingLeft).toEqual(goLeft);
      });
    });
  };

  describe("starting", function() {
    var params = {
      hasPrev: false,
      hasNext: true,
      currentPage: 1,
      totalPages: 3,
      goingLeft: false
    }

    sharedBehaviorForPage(params);

    describe("when previous button is clicked (third page)", function() {
      params = {
        hasPrev: true,
        hasNext: true,
        currentPage: 3,
        totalPages: 4,
        goingLeft: false
      }

      sharedBehaviorForPage(params, function() {
        $(".prev").click();
      });

      describe(", and back button is clicked again (second page)", function() {
        params = {
          hasPrev: true,
          hasNext: true,
          currentPage: 2,
          totalPages: 4,
          goingLeft: false
        }

        sharedBehaviorForPage(params, function() {
          $(".prev").click();
          track.prev();
        });
      });

      describe(", and next is button clicked again (first page)", function() {
        params = {
          hasPrev: false,
          hasNext: true,
          currentPage: 1,
          totalPages: 3,
          goingLeft: false
        }

        sharedBehaviorForPage(params, function() {
          $(".prev").click();
          track.next();
        });
      });
    });

    describe("when the next button is clicked (second page)", function() {
      params = {
        hasPrev: true,
        hasNext: true,
        currentPage: 2,
        totalPages: 4,
        goingLeft: false
      }

      sharedBehaviorForPage(params, function() {
        track.next()
      });

      describe(", and back button is clicked (first page)", function() {
        params = {
          hasPrev: false,
          hasNext: true,
          currentPage: 1,
          totalPages: 3,
          goingLeft: false
        }

        sharedBehaviorForPage(params, function() {
          track.prev();
        });        
      });

      describe(", and next button is clicked (third Page)", function() {
        params = {
          hasPrev: true,
          hasNext: true,
          currentPage: 3,
          totalPages: 4,
          goingLeft: false
        }
        
        sharedBehaviorForPage(params, function() {
          track.next();
          track.next();
        });

        describe(", and next button is clicked (first page)", function() {
          params = {
            hasPrev: false,
            hasNext: true,
            currentPage: 1,
            totalPages: 3,
            goingLeft: false
          }
          
          sharedBehaviorForPage(params, function() {
            track.next();
            track.next();
            track.next();
          });
        });
      });
    })
  });

  describe("when the autoPlay option is true", function() {
    
    beforeEach(function() {
      jasmine.Clock.useMock()
      loadFixtures("basic.html");
      $.fx.off = true;
      track = helpers.basic();
      circularPlugin = new SilverTrack.Plugins.CircularNavigator({autoPlay: true});
      navigatorPlugin = new SilverTrack.Plugins.Navigator({
        prev: $("a.prev", track.container.parent().parent()),
        next: $("a.next", track.container.parent().parent())
      });

      track.install(navigatorPlugin);
      track.install(circularPlugin);
      track.start();
      nextCall = spyOn(track, "next");
    });
  
    it("autoPlay options should be true", function() {
      expect(circularPlugin.options.autoPlay).toEqual(true);
    });

    it("should call next 1 time", function() {
      jasmine.Clock.tick(3100)
      expect(nextCall.callCount).toEqual(1);
    });

    it("should call next 2 time", function() {
      jasmine.Clock.tick(6100)
      expect(nextCall.callCount).toEqual(2);
    });

    it("should call next 3 times", function() {
      jasmine.Clock.tick(9100)
      expect(nextCall.callCount).toEqual(3);
    });
  });

  describe("method tests", function() {
    beforeEach(function() {
      jasmine.Clock.useMock();
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
        var options = null;
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

    describe("#afterStart", function() {
      it("should run the first cycle to verify and add cloned pages", function() {
        spyOn(circularPlugin, "_hasManyPages").andReturn(true)
        spyOn(circularPlugin, "beforePagination");
        spyOn(circularPlugin, "afterAnimation");

        circularPlugin.afterStart();

        expect(circularPlugin.beforePagination).toHaveBeenCalled();
        expect(circularPlugin.afterAnimation).toHaveBeenCalled();
      });
    });

    describe("#afterRestart", function() {
      it("should enable buttons", function() {
        spyOn(circularPlugin, "_enableButtons");
        circularPlugin.afterRestart();
        expect(circularPlugin._enableButtons).toHaveBeenCalled()
      });
    });

    describe("#beforePagination", function() {
      it("should create a new cloned page if the focused page is the last full page", function() {
        spyOn(circularPlugin, "_appendItems");
        spyOn(circularPlugin.track, "reloadItems");
        spyOn(circularPlugin, "_lastCompletedPage").andReturn(track.currentPage);

        circularPlugin.beforePagination();

        expect(circularPlugin._appendItems).toHaveBeenCalled();
        expect(track.reloadItems).toHaveBeenCalled();
      });
    });

    describe("#afterAnimation", function() {
      it("should enable buttons", function() {
        spyOn(circularPlugin, "_enableButtons");
        circularPlugin.afterAnimation();
        expect(circularPlugin._enableButtons).toHaveBeenCalled();
      });

      describe("when the last full page is in focus", function() {

        beforeEach(function() {
          spyOn(circularPlugin, "_lastCompletedPage").andReturn(track.currentPage);
          spyOn(circularPlugin.track, "restart");
          spyOn(circularPlugin, "_changeFowardPage");
          circularPlugin.afterAnimation();
        });

        it("should restart at the same page to reload items", function() {
          expect(track.restart).toHaveBeenCalledWith({
            keepCurrentPage: true,
            animate: false
          });
        });

        it("should calculate last foward page", function() {
          expect(circularPlugin._changeFowardPage).toHaveBeenCalled();
        });

        it("should not return to the first page", function() {
          expect(track.restart).not.toHaveBeenCalledWith();
        });
      });

      describe("when the cloned page is in focus", function() {
        beforeEach(function() {
          spyOn(track, "currentPage").andReturn(track.totalPages);
          spyOn(track, "currentPages").andReturn(track.totalPages);
          spyOn(track, "totalPages").andReturn(track.totalPage + 1);
          spyOn(circularPlugin.track, "restart");

          circularPlugin.afterAnimation();

          it("should return to the first page", function() {
            expect(track.restart).toHaveBeenCalledWith({
              page: 1,
              animate: false
            });
          });

          it("should not restart at the same page to reload items", function() {   
            expect(track.restart).not.toHaveBeenCalledWith();
          });
        });      
      });
    });
  });
});