describe("SilverTrack", function() {
  var track = null;
  var plugin = null;

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");

    $.fx.off = true;

    $.silverTrackPlugin("Generic", {});
    plugin = new SilverTrack.Plugins.Generic();
  });

  describe("Plugin initialization", function() {

    it("should use default values", function() {
      track = helpers.basic();
      expect(track.opts.perPage).toBe(4);
      expect(track.opts.itemClass).toBe("item");
      expect(track.opts.cover).toBe(false);
    });

    it("should allow the user to override the default values", function() {
      track = helpers.basic({perPage: 1, itemClass: "new-class", cover: true});
      expect(track.opts.perPage).toBe(1);
      expect(track.opts.itemClass).toBe("new-class");
      expect(track.opts.cover).toBe(true);
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

    it("should hold the reference of the container", function() {
      var container = $("#basic");
      expect(container.silverTrack().container).toBe(container);
    });

    it("should have zero plugins", function() {
      expect(helpers.basic().plugins.length).toBe(0);
    });

  });

  describe("#start", function() {
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
      track.start();
      expect(track.itemWidth).toBe(240);
    });

    it("should set container 'left' to '0px'", function() {
      track.start();
      expect(track.container.css("left")).toBe("0px");
    });

    it("should position the elements", function() {
      track.start();
      var items = $("#basic").find(".item");
      expect($(items[0]).css("left")).toBe("0px");
      expect($(items[1]).css("left")).toBe("240px");
      expect($(items[2]).css("left")).toBe("480px");
    });

    it("should calculate 'totalPages' based on DOM elements", function() {
      track.start();
      expect(track.totalPages).toBe(3);
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

    it("should do nothing if newPage is equal to currentPage", function() {
      spyOn(track, "_animate");
      track.currentPage = 2;
      expect(track.currentPage).toBe(2);

      track.goToPage(2);
      expect(track._animate).not.toHaveBeenCalled();
      expect(track.currentPage).toBe(2);
    });

    describe("without cover", function() {
      beforeEach(function() {
        track.install(plugin);
        expect(track.currentPage).toBe(1);
        expect(track._calculateContainerLeft()).toBe(0);
        expect(track.itemWidth).toBe(240);
        expect(track.opts.perPage).toBe(4);
      });

      it("should animate to first item of the informed page", function() {
        track.goToPage(2);
        expect(track.currentPage).toBe(2);
        expect(track._calculateContainerLeft()).toBe(240 * 4);
      });

      it("should animate just enough items", function() {
        track.goToPage(3);
        expect(track.currentPage).toBe(3);
        expect(track._calculateContainerLeft()).toBe(240 * 5); // 3 + 1
      });

      describe("going forward", function() {
        it("should call 'beforePagination' with the proper event", function() {
          spyOn(plugin, 'beforePagination');
          track.goToPage(2);
          expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
            name: "next",
            page: 2,
            cover: false
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
            cover: false
          });
        });
      });
    });

    describe("with cover", function() {
      beforeEach(function() {
        loadFixtures("cover.html");
        track = helpers.cover();
        track.install(plugin);
        track.start();

        expect(track.opts.cover).toBe(true);
        expect(track.currentPage).toBe(1);
        expect(track._calculateContainerLeft()).toBe(0);
        expect(track.itemWidth).toBe(240);
        expect(track.opts.perPage).toBe(4);
      });

      it("should animate to first item of the informed page", function() {
        track.goToPage(2);
        expect(track.currentPage).toBe(2);
        expect(track._calculateContainerLeft()).toBe(956); // shift the cover
      });

      it("should animate just enough items", function() {
        track.goToPage(3);
        expect(track.currentPage).toBe(3);
        expect(track._calculateContainerLeft()).toBe(1196); // 3 + 1
      });

      it("should consider the cover as a page", function() {
        expect(track._getCover().outerWidth(true)).toBe(956);
        track.goToPage(2);
        expect(track.currentPage).toBe(2);
        expect(track._calculateContainerLeft()).toBe(956);

        track.goToPage(1);
        expect(track.currentPage).toBe(1);
        expect(track._calculateContainerLeft()).toBe(0);
      });

      describe("going forward", function() {
        it("should call 'beforePagination' with the proper event", function() {
          spyOn(plugin, 'beforePagination');
          track.goToPage(2);
          expect(plugin.beforePagination).toHaveBeenCalledWith(track, {
            name: "next",
            page: 2,
            cover: false
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
            cover: true
          });
        });
      });
    });
  });

  describe("#next", function() {
    describe("without cover", function() {
    });

    describe("with cover", function() {
    });
  });

  describe("#hasNext", function() {
    describe("without cover", function() {
    });

    describe("with cover", function() {
    });
  });

  describe("#prev", function() {
    describe("without cover", function() {
    });

    describe("with cover", function() {
    });
  });

  describe("#hasPrev", function() {
    describe("without cover", function() {
    });

    describe("with cover", function() {
    });
  });

  describe("#restart", function() {
    describe("without cover", function() {
    });

    describe("with cover", function() {
    });
  });

  describe("#install", function() {
    describe("without cover", function() {
    });

    describe("with cover", function() {
    });
  });

  describe("Plugins integration", function() {
  });

});
