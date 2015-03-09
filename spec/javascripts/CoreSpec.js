describe("$.silverTrack", function() {
  var track = null;
  var plugin = null;
  var items = null;

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");

    $.fx.off = true;

    $.silverTrackPlugin("Generic", {});
    plugin = new SilverTrack.Plugins.Generic();
  });

  describe("Initialization", function() {

    it("should use default values", function() {
      track = helpers.basic();
      expect(track.options.perPage).toBe(4);
      expect(track.options.itemClass).toBe("item");
      expect(track.options.cover).toBe(false);
      expect(track.options.mode).toBe("horizontal");
      expect(track.options.autoHeight).toBe(false);
      expect(track.options.duration).toBe(600);
      expect(track.options.easing).toBe("swing");
      expect(track.options.animateFunction).toBe(null);
      expect(track.options.animationAxis).toBe("x");
    });

    it("should allow the user to override the default values", function() {
      track = helpers.basic({
        perPage: 1,
        itemClass: "new-class",
        cover: true,
        mode: "vertical",
        autoHeight: true,
        animateFunction: $.noop,
        animationAxis: "y"
      });

      expect(track.options.perPage).toBe(1);
      expect(track.options.itemClass).toBe("new-class");
      expect(track.options.cover).toBe(true);
      expect(track.options.mode).toBe("vertical");
      expect(track.options.autoHeight).toBe(true);
      expect(track.options.animateFunction).toEqual(jasmine.any(Function));
      expect(track.options.animationAxis).toBe("y");
    });

    it("should keep the instance in a data attribute", function() {
      track = helpers.basic();
      expect($("#basic").data("silverTrackInstance")).toBe(track);
    });

    it("should retrieve the instance if initialized again", function() {
      track = helpers.basic();
      expect(helpers.basic()).toBe(track);
    });

    it("should set the 'currentPage' to 1", function() {
      expect(helpers.basic().currentPage).toBe(1);
    });

    it("should set the 'totalPages' to 1", function() {
      expect(helpers.basic().totalPages).toBe(1);
    });

    it("should hold the reference of the container", function() {
      var container = $("#basic");
      expect(container.silverTrack().container).toBe(container);
    });

    it("should have zero plugins", function() {
      expect(helpers.basic().plugins.length).toBe(0);
    });

  });

  describe("#isSilverTrackInstalled", function() {

    it("should return true if already initialized on the node", function() {
      var track = helpers.basic();
      expect( $("#basic").isSilverTrackInstalled()).toBe(true);
    });

    it("should return false if not initialized on the node", function() {
      expect($("#basic").isSilverTrackInstalled()).toBe(false);
    });

  });

  describe("#start", function() {
    describe("common behavior", function() {
      beforeEach(function() {
        track = helpers.basic();
        track.install(plugin);
      });

      it("should call 'beforeStart'", function() {
        spyOn(plugin, 'beforeStart');
        track.start();
        expect(plugin.beforeStart).toHaveBeenCalledWith(track);
      });

      it("should calculate 'itemWidth'", function() {
        expect(track.itemWidth).toBe(undefined);
        track.start();
        expect(track.itemWidth).toBe(240);
      });

      describe("with animationAxis 'y'", function() {
        it("should calculate 'animatedAttribute'", function() {
          expect(track.animatedAttribute).toBe(undefined);
          track.options.animationAxis = "y";
          track.start();
          expect(track.animatedAttribute).toBe("top");
        });
      });

      describe("with animationAxis with another value", function() {
        it("should calculate 'animatedAttribute'", function() {
          expect(track.animatedAttribute).toBe(undefined);
          track.start();
          expect(track.animatedAttribute).toBe("left");
        });
      });

      describe("when initializing the container animated attribute", function() {
        it("should set container 'left' to '0px' when 'animatedAttribute' is 'left'", function() {
          track.start();
          expect(track.container.css("left")).toBe("0px");
        });

        it("should set container 'top' to '0px' when 'animatedAttribute' is 'top'", function() {
          track.options.animationAxis = "y";
          track.start();
          expect(track.container.css("top")).toBe("0px");
        });
      });

      it("should calculate 'totalPages' based on DOM elements", function() {
        track.start();
        expect(track.totalPages).toBe(3);
      });

      it("should cache items", function() {
        expect(track._items).toBe(null);
        track.start();
        expect(track._items).toBe(track._getItems());
      });
    });

    describe("with mode 'horizontal'", function() {
      beforeEach(function() {
        track = helpers.basic({mode: "horizontal"});
        track.install(plugin);
      });

      it("should position the elements", function() {
        track.start();
        var items = $("#basic").find(".item");
        expect($(items[0]).css("left")).toBe("0px");
        expect($(items[1]).css("left")).toBe("240px");
        expect($(items[2]).css("left")).toBe("480px");
      });

      it("should add the width of the container", function() {
        track.start();
        expect(track.container.attr("style")).toMatch("width: 2160px;");
      });
    });

    describe("with mode 'vertical'", function() {
      beforeEach(function() {
        track = helpers.basic({mode: "vertical"});
        track.install(plugin);
      });

      it("should position the elements", function() {
        track.start();
        var items = $("#basic").find(".item");

        // page 1
        expect($(items[0]).css("left")).toBe("0px");
        expect($(items[0]).css("top")).toBe("0px");

        expect($(items[1]).css("left")).toBe("0px");
        expect($(items[1]).css("top")).toBe("166px");

        expect($(items[2]).css("left")).toBe("0px");
        expect($(items[2]).css("top")).toBe("332px");

        expect($(items[3]).css("left")).toBe("0px");
        expect($(items[3]).css("top")).toBe("498px");

        // page 2
        expect($(items[4]).css("left")).toBe("240px");
        expect($(items[4]).css("top")).toBe("0px");

        expect($(items[5]).css("left")).toBe("240px");
        expect($(items[5]).css("top")).toBe("166px");

        expect($(items[6]).css("left")).toBe("240px");
        expect($(items[6]).css("top")).toBe("332px");

        expect($(items[7]).css("left")).toBe("240px");
        expect($(items[7]).css("top")).toBe("498px");
      });

      it("should add the width of the container", function() {
        track.start();
        expect(track.container.attr("style")).toMatch("width: 720px");
      });
    });

    describe("with cover", function() {
      beforeEach(function() {
        loadFixtures("cover.html");

        track = helpers.cover();
        track.install(plugin);
      });

      it("should calculate 'coverWidth'", function() {
        track.start();
        expect(track.coverWidth).toBe(956);
      });

      it("should count the cover as one page", function() {
        track.start();
        expect(track.totalPages).toBe(3);
      });
    });
  });

  describe("#goToPage", function() {
    describe("when animating with $.fn.animate", function() {
      var easing = "easeInOutQuad";
      var duration = 600;

      beforeEach(function() {
        track = helpers.basic({easing: easing, duration: duration});
      });

      it("should use the configured easing and duration", function() {
        track.start();
        spyOn($.fn, "animate");
        track.goToPage(2);

        var movement = {"left": "-960px"};
        expect($.fn.animate).toHaveBeenCalledWith(movement, duration, easing, jasmine.any(Function));
      });

      it("should fallback to default if the easing function does not exist", function() {
        var aux = $.easing[easing];
        delete $.easing[easing];
        expect($.easing[easing]).toBe(undefined);

        track.start();
        expect(track.options.easing).toBe($.fn.silverTrack.options.easing);
        $.easing[easing] = aux;
      });
    });

    describe("when animating with custom animate function", function() {
      var easing = "easeInOutQuad";
      var duration = 600;

      beforeEach(function() {
        track = helpers.basic({easing: easing, duration: duration, animateFunction: $.noop});
        spyOn(track.options, "animateFunction");
      });

      it("should inform the movement value, the after callback, the configured easing and duration", function() {
        track.start();
        track.goToPage(2);

        var movement = {"left": "-960px"};
        expect(track.options.animateFunction).toHaveBeenCalledWith(
          movement, duration, easing, jasmine.any(Function)
        );
      });
    });

    describe("common behavior", function() {
      beforeEach(function() {
        track = helpers.basic();
        track.start();
      });

      it("should do nothing if pagination is disabled", function() {
        spyOn(track, "_animate");
        track.paginationEnabled = false;
        expect(track.currentPage).toBe(1);

        track.goToPage(2);
        expect(track._animate).not.toHaveBeenCalled();
        expect(track.currentPage).toBe(1);
      });

      it("should do nothing if newPage is less than currentPage and currentPage is the first page", function() {
        spyOn(track, "_animate");
        expect(track.currentPage).toBe(1);

        track.goToPage(-1);
        expect(track._animate).not.toHaveBeenCalled();
        expect(track.currentPage).toBe(1);
      });

      it("should do nothing if newPage is greater than totalPages", function() {
        spyOn(track, "_animate");
        track.totalPages = 2;
        expect(track.currentPage).toBe(1);
        expect(track.totalPages).toBe(2);

        track.goToPage(3);
        expect(track._animate).not.toHaveBeenCalled();
        expect(track.currentPage).toBe(1);
      });

      it("should call all 'before_pagination' callbacks before change the current page", function() {
        track.install(plugin)

        spyOn(track, "_slide");
        spyOn(track, "_adjustHeight");

        var currentPage = track.currentPage;
        var beforePaginationValidated = false;

        spyOn(plugin, "beforePagination").andCallFake(function() {
          expect(track.currentPage).toEqual(currentPage);
          beforePaginationValidated = true;
        });

        track.goToPage(currentPage + 1);

        expect(plugin.beforePagination).toHaveBeenCalled();
        expect(track.currentPage).toEqual(currentPage + 1);
        expect(beforePaginationValidated).toEqual(true);
      });

      describe("'animate' option", function() {
        beforeEach(function() {
          spyOn(track, "_slide");
          track.currentPage = 1;
          expect(track.currentPage).toBe(1);
        });

        it("should be true by default", function() {
          track.goToPage(2);
          expect(track._slide).toHaveBeenCalledWith(
            jasmine.any(Number), jasmine.any(Object), track.options.duration
          );
        });

        it("should be allowed to change", function() {
          track.goToPage(2, {animate: false});
          expect(track._slide).toHaveBeenCalledWith(
            jasmine.any(Number), jasmine.any(Object), 0
          );
        });
      });
    });

    describe("without cover", function() {
      describe("axis 'x'", function() {
        beforeEach(function() {
          track = helpers.basic();
          track.install(plugin);
          track.start();
          items = track._calculateItemsForPagination(1);

          expect(track.currentPage).toBe(1);
          expect(track._calculateItemPosition(items.get(0))).toBe(0);
          expect(track.itemWidth).toBe(240);
          expect(track.options.perPage).toBe(4);
        });

        it("should animate to first item of the informed page", function() {
          track.goToPage(2);
          expect(track.currentPage).toBe(2);

          items = track._calculateItemsForPagination(2);
          expect(track._calculateItemPosition(items.get(0))).toBe(240 * 4);
        });

        it("should animate just enough items", function() {
          track.goToPage(3);
          expect(track.currentPage).toBe(3);

          items = track._calculateItemsForPagination(3);

          var shift = track._calculateItemPosition(items.get(0));
          shift -= track._calculateMaxShiftAvailable(items);

          expect(shift).toBe(240 * 5); // 3 + 1
        });

        describe("going forward", function() {
          it("should call 'beforePagination' with the proper event", function() {
            spyOn(plugin, 'beforePagination');
            track.goToPage(2);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "next",
              page: 2,
              cover: false,
              items: jasmine.any(Object)
            });
          });
        });

        describe("going backwards", function() {
          it("should call 'beforePagination' with the proper event", function() {
            track.goToPage(2);
            spyOn(plugin, 'beforePagination');
            track.goToPage(1);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "prev",
              page: 1,
              cover: false,
              items: jasmine.any(Object)
            });
          });
        });
      });

      describe("axis 'y' and mode 'vertical'", function() {
        beforeEach(function() {
          $(".track").addClass("axis-y");
          track = helpers.basic({mode: "vertical", animationAxis: "y"});
          track.install(plugin);
          track.start();

          items = track._calculateItemsForPagination(1);

          expect(track.currentPage).toBe(1);
          expect(track._calculateItemPosition(items.get(0))).toBe(0);
          expect(track.itemHeight).toBe(166);
          expect(track.options.perPage).toBe(4);
        });

        it("should animate to first item of the informed page", function() {
          track.goToPage(2);
          expect(track.currentPage).toBe(2);

          items = track._calculateItemsForPagination(2);
          expect(track._calculateItemPosition(items.get(0))).toBe(166 * 4);
        });

        it("should animate just enough items", function() {
          track.goToPage(3);
          expect(track.currentPage).toBe(3);

          items = track._calculateItemsForPagination(3);

          var shift = track._calculateItemPosition(items.get(0));
          shift -= track._calculateMaxShiftAvailable(items);

          expect(shift).toBe(166 * 5); // 3 + 1
        });

        describe("going forward", function() {
          it("should call 'beforePagination' with the proper event", function() {
            spyOn(plugin, 'beforePagination');
            track.goToPage(2);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "next",
              page: 2,
              cover: false,
              items: jasmine.any(Object)
            });
          });
        });

        describe("going backwards", function() {
          it("should call 'beforePagination' with the proper event", function() {
            track.goToPage(2);
            spyOn(plugin, 'beforePagination');
            track.goToPage(1);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "prev",
              page: 1,
              cover: false,
              items: jasmine.any(Object)
            });
          });
        });
      });
    });

    describe("with cover", function() {
      describe("axis 'x'", function() {
        beforeEach(function() {
          loadFixtures("cover.html");
          track = helpers.cover();
          track.install(plugin);
          track.start();

          items = track._getCover();

          expect(track.options.cover).toBe(true);
          expect(track.currentPage).toBe(1);
          expect(track._calculateItemPosition(items.get(0))).toBe(0);
          expect(track.itemWidth).toBe(240);
          expect(track.options.perPage).toBe(4);
        });

        it("should animate to first item of the informed page", function() {
          track.goToPage(2);
          expect(track.currentPage).toBe(2);
          items = track._calculateItemsForPagination(2);

          expect(track._calculateItemPosition(items.get(0))).toBe(956); // shift the cover
        });

        it("should animate just enough items", function() {
          track.goToPage(3);
          expect(track.currentPage).toBe(3);
          items = track._calculateItemsForPagination(3);

          var shift = track._calculateItemPosition(items.get(0));
          shift -= track._calculateMaxShiftAvailable(items);

          expect(shift).toBe(1196); // 3 + 1
        });

        it("should consider the cover as a page", function() {
          expect(track._getCover().outerWidth(true)).toBe(956);
          track.goToPage(2);
          expect(track.currentPage).toBe(2);
          items = track._calculateItemsForPagination(2);
          expect(track._calculateItemPosition(items.get(0))).toBe(956);

          track.goToPage(1);
          expect(track.currentPage).toBe(1);
          items = track._getCover();
          expect(track._calculateItemPosition(items.get(0))).toBe(0);
        });

        describe("going forward", function() {
          it("should call 'beforePagination' with the proper event", function() {
            spyOn(plugin, 'beforePagination');
            track.goToPage(2);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "next",
              page: 2,
              cover: false,
              items: jasmine.any(Object)
            });
          });
        });

        describe("going backwards", function() {
          it("should call 'beforePagination' with the proper event", function() {
            track.goToPage(2);
            spyOn(plugin, 'beforePagination');
            track.goToPage(1);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "prev",
              page: 1,
              cover: true,
              items: jasmine.any(Object)
            });
          });
        });
      });

      describe("axis 'y' and mode 'vertical'", function() {
        beforeEach(function() {
          loadFixtures("cover.html");
          $(".track:last").addClass("axis-y");
          $(".track:last .view-port h2").remove();
          $(".track:last .item.cover > img:first").remove();

          track = helpers.cover({mode: "vertical", animationAxis: "y", perPage: 2});
          track.install(plugin);
          track.start();

          items = track._getCover();

          expect(track.options.cover).toBe(true);
          expect(track.currentPage).toBe(1);
          expect(track._calculateItemPosition(items.get(0))).toBe(0);
          expect(track.itemHeight).toBe(304);
          expect(track.options.perPage).toBe(2);
        });

        it("should animate to first item of the informed page", function() {
          track.goToPage(2);
          expect(track.currentPage).toBe(2);
          items = track._calculateItemsForPagination(2);

          expect(track._calculateItemPosition(items.get(0))).toBe(592); // shift the cover
        });

        it("should animate just enough items", function() {
          track.goToPage(4);
          expect(track.currentPage).toBe(4);
          items = track._calculateItemsForPagination(4);

          var shift = track._calculateItemPosition(items.get(0));
          shift -= track._calculateMaxShiftAvailable(items);

          expect(shift).toBe(1504); // 3 + 1
        });

        it("should consider the cover as a page", function() {
          expect(track._getCover().outerHeight(true)).toBe(592);
          track.goToPage(2);
          expect(track.currentPage).toBe(2);
          items = track._calculateItemsForPagination(2);
          expect(track._calculateItemPosition(items.get(0))).toBe(592);

          track.goToPage(1);
          expect(track.currentPage).toBe(1);
          items = track._getCover();
          expect(track._calculateItemPosition(items.get(0))).toBe(0);
        });

        describe("going forward", function() {
          it("should call 'beforePagination' with the proper event", function() {
            spyOn(plugin, 'beforePagination');
            track.goToPage(2);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "next",
              page: 2,
              cover: false,
              items: jasmine.any(Object)
            });
          });
        });

        describe("going backwards", function() {
          it("should call 'beforePagination' with the proper event", function() {
            track.goToPage(2);
            spyOn(plugin, 'beforePagination');
            track.goToPage(1);
            expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
              name: "prev",
              page: 1,
              cover: true,
              items: jasmine.any(Object)
            });
          });
        });
      });
    });

    describe("with mode 'vertical'", function() {
       beforeEach(function() {
        track = helpers.basic({mode: "vertical"});
        track.start();
       });

      it("should animate the whole page even if in vertical does not exist enough items", function() {
        expect(track.totalPages).toBe(3);
        track.goToPage(3);
        expect(track.currentPage).toBe(3);
        items = track._calculateItemsForPagination(3);
        expect(track._calculateItemPosition(items.get(0))).toBe(480); // third page (0, 240, 480)
      });
    });

    describe("with autoHeight true", function() {
      describe("common behavior", function() {
        beforeEach(function() {
          track = helpers.basic({autoHeight: true});
          track.install(plugin);
          track.start();
        });

        it("should call 'beforeAdjustHeight'", function() {
          spyOn(plugin, 'beforeAdjustHeight');
          track.goToPage(3);
          expect(plugin.beforeAdjustHeight).toHaveBeenCalledWith(track, {
            items: jasmine.any(Object),
            newHeight: 166
          });
        });

        it("should call 'afterAdjustHeight'", function() {
          spyOn(plugin, 'afterAdjustHeight');
          track.goToPage(3);
          expect(plugin.afterAdjustHeight).toHaveBeenCalledWith(track, {
            items: jasmine.any(Object),
            newHeight: 166
          });
        });
      });

      describe("using mode 'horizontal'", function() {
        beforeEach(function() {
          track = helpers.basic({autoHeight: true, mode: "horizontal"});
          track.start();
        });

        it("should set the container height to the height of the first item of the page", function() {
          track.goToPage(3);
          var firstPageItem = $("." + track.options.itemClass + ":eq(8)").outerHeight(true);
          expect(track.container.css("height")).toBe(firstPageItem + "px");
        });
      });

      describe("using mode 'vertical'", function() {
        beforeEach(function() {
          track = helpers.basic({autoHeight: true, mode: "vertical"});
          track.start();
        });

        it("should set the container height to the sum of items", function() {
          track.goToPage(2);
          expect(track.container.css("height")).toBe((166 * 4) + "px");

          track.goToPage(3);
          expect(track.container.css("height")).toBe((166 * 1) + "px");

          track.goToPage(1);
          expect(track.container.css("height")).toBe((166 * 4) + "px");
        });
      });
    });
  });

  describe("#next", function() {
    beforeEach(function() {
      track = helpers.basic();
      track.start();
    });

    it("should call 'goToPage' incrementing currentPage", function() {
      expect(track.currentPage).toBe(1);
      spyOn(track, "goToPage");
      track.next();
      expect(track.goToPage).toHaveBeenCalledWith(2);
    });
  });

  describe("#hasNext", function() {
    beforeEach(function() {
      track = helpers.basic();
      track.start();
    });

    it("should be true when currentPage is lower than totalPages", function() {
      track.totalPages = 2;
      expect(track.currentPage).toBe(1);
      expect(track.hasNext()).toBe(true);
    });

    it("should be false when currentPage is equal to totalPages", function() {
      track.totalPages = 2;
      track.currentPage = 2;
      expect(track.totalPages).toBe(2);
      expect(track.currentPage).toBe(2);
      expect(track.hasNext()).toBe(false);
    });

    it("should be false when totalPages is less or equal to 1", function() {
      track.totalPages = 1
      expect(track.hasNext()).toBe(false);

      track.totalPages = 0;
      expect(track.hasNext()).toBe(false);
    });
  });

  describe("#prev", function() {
    it("should call 'goToPage' decrementing currentPage", function() {
      track.currentPage = 2;
      expect(track.currentPage).toBe(2);
      spyOn(track, "goToPage");
      track.prev();
      expect(track.goToPage).toHaveBeenCalledWith(1);
    });
  });

  describe("#hasPrev", function() {
    it("should be true when currentPage is greater than 1", function() {
      track.currentPage = 2;
      expect(track.currentPage).toBe(2);
      expect(track.hasPrev()).toBe(true);
    });

    it("should be false when currentPage is 1", function() {
      track.currentPage = 1;
      expect(track.currentPage).toBe(1);
      expect(track.hasPrev()).toBe(false);
    });
  });

  describe("#isModeHorizontal", function() {
    it("should be true when 'mode' is 'horizontal'", function() {
      track.options.mode = "horizontal";
      expect(track.isModeHorizontal()).toBe(true);
    });

    it("should be false when 'mode' has another value", function() {
      track.options.mode = "vertical";
      expect(track.isModeHorizontal()).toBe(false);

      track.options.mode = "another";
      expect(track.isModeHorizontal()).toBe(false);
    });
  });

  describe("#isAxisY", function() {
    it("should be true when 'animationAxis' is 'y'", function() {
      track.options.animationAxis = "y";
      expect(track.isAxisY()).toBe(true);
    });

    it("should be false when 'animationAxis' has another value", function() {
      track.options.animationAxis = "x";
      expect(track.isAxisY()).toBe(false);

      track.options.animationAxis = "z";
      expect(track.isAxisY()).toBe(false);
    });
  });

  describe("#restart", function() {
    beforeEach(function() {
      track = helpers.basic();
      track.install(plugin);
      track.start();
    });

    it("should reenable pagination", function() {
      track.paginationEnabled = false;
      expect(track.paginationEnabled).toBe(false);
      track.restart();
      expect(track.paginationEnabled).toBe(true);
    });

    it("should reset currentPage to 1 by default", function() {
      track.currentPage = 3;
      expect(track.currentPage).toBe(3);
      track.restart();
      expect(track.currentPage).toBe(1);
    });

    it("should set container 'left' to '0px'", function() {
      track.goToPage(2);
      expect(track.container.css("left")).toBe("-960px");
      track.restart();
      expect(track.container.css("left")).toBe("0px");
    });

    it("should call 'beforeRestart'", function() {
      spyOn(plugin, 'beforeRestart');
      track.restart();
      expect(plugin.beforeRestart).toHaveBeenCalledWith(track);
    });

    it("should call 'afterRestart'", function() {
      spyOn(plugin, 'afterRestart');
      track.restart();
      expect(plugin.afterRestart).toHaveBeenCalledWith(track);
    });

    it("should reset the height of the container", function() {
      track.container.css("height", "150px");
      expect(track.container.attr("style")).toMatch("height: 150px;");
      track.restart();
      expect(track.container.attr("style")).not.toMatch("height: 150px;");
    });

    it("should reset the top of the items", function() {
      track._getItems().each(function(index, value) {
        var item = $(value);
        item.css("top", "10px");
        expect(item.attr("style")).toMatch("top: 10px;");
      });

      track.restart();

      track._getItems().each(function(index, value) {
        expect($(value).attr("style")).not.toMatch("top: 10px;");
      });
    });

    describe("options", function() {
      beforeEach(function() {
        spyOn(track, "goToPage");
      });

      describe("'animate'", function() {
        it("should be false by default", function() {
          track.restart();
          expect(track.goToPage).toHaveBeenCalledWith(jasmine.any(Number), {animate: false});
        });

        it("should be changed", function() {
          track.restart({animate: true});
          expect(track.goToPage).toHaveBeenCalledWith(jasmine.any(Number), {animate: true});
        });
      });

      describe("'page'", function() {
        it("should be 1 by default", function() {
          track.restart();
          expect(track.goToPage).toHaveBeenCalledWith(1, jasmine.any(Object));
        });

        it("should be able to go to any page after restart", function() {
          track.restart({page: 3});
          expect(track.goToPage).toHaveBeenCalledWith(3, jasmine.any(Object));
        });
      });

      describe("'keepCurrentPage' true", function() {
        var currentPage = 2;
        beforeEach(function() {
          track.currentPage = currentPage;
        });

        it("should use the 'currentPage'", function() {
          track.restart({keepCurrentPage: true});
          expect(track.goToPage).toHaveBeenCalledWith(currentPage, jasmine.any(Object));
        });

        it("should overrides the 'page' option", function() {
          track.restart({page: 3, keepCurrentPage: true});
          expect(track.goToPage).toHaveBeenCalledWith(currentPage, jasmine.any(Object));
        });
      });

    });
  });

  describe("#reloadItems", function() {
    beforeEach(function() {
      track = helpers.basic();
    });

    it("should clear the items cache", function() {
      track.start();
      expect(track._items).not.toBe(null);
      track.reloadItems();
      expect(track._items).toBe(null);
    });
  });

  describe("#updateTotalPages", function() {
    beforeEach(function() {
      track = helpers.basic();
      track.install(plugin);
      track.start();
    });

    it("should disable the totalPages calculation", function() {
      expect(track.calculateTotalPages).toBe(true);
      track.updateTotalPages(1);
      expect(track.calculateTotalPages).toBe(false);
    });

    it("should set the totalPages value", function() {
      expect(track.totalPages).toBe(3);
      track.updateTotalPages(10);
      expect(track.totalPages).toBe(10);
    });

    it("should use the absolute value", function() {
      track.updateTotalPages(-14);
      expect(track.totalPages).toBe(14);
    });

    it("should convert to integer", function() {
      track.updateTotalPages("2");
      expect(track.totalPages).toBe(2);
    });

    it("should call 'onTotalPagesUpdate'", function() {
      spyOn(plugin, 'onTotalPagesUpdate');
      track.updateTotalPages(2);
      expect(plugin.onTotalPagesUpdate).toHaveBeenCalledWith(track);
    });
  });

  describe("#install", function() {
    beforeEach(function() {
      track = helpers.basic();
    });

    it("should register the new plugin", function() {
      track.install(plugin);
      expect(track.plugins[0]).toBe(plugin);
    });

    it("should call 'onInstall'", function() {
      spyOn(plugin, "onInstall");
      track.install(plugin);
      expect(plugin.onInstall).toHaveBeenCalledWith(track);
    });

    it("should return the silverTrack instance", function() {
      expect(track.install(plugin)).toBe(track);
    });
  });

  describe("#findPluginByName", function() {
    var plugin1, plugin2;

    beforeEach(function() {
      plugin1 = {PluginName: "SomePlugin1"};
      plugin2 = {PluginName: "SomePlugin2"};

      track = helpers.basic();
      track.install(plugin1);
      track.install(plugin2);
    });

    describe("when the plugin exists", function() {
      it("should return the plugin that matches", function() {
        var expected = track.findPluginByName("SomePlugin2");
        expect(expected.PluginName).toBe("SomePlugin2");
      });
    });

    describe("when does not exist", function() {
      it("should return null", function() {
        expect(track.findPluginByName("Wrong")).toBe(null);
      });
    });
  });

});
