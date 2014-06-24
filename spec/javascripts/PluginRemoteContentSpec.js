describe("SilverTrack.Plugins.RemoteContent", function() {
  var request = null;
  var track = null;
  var plugin = null;

  var mockAjaxOnePage = function() {
    spyOn(plugin, "ajaxFunction").andCallFake(function(e) {
      e.success(helpers.ajaxResponses.onePage);
    });
  }

  var mockAjaxMultiplePages = function(verificationCallback) {
    spyOn(plugin, "ajaxFunction").andCallFake(function(e) {
      e.success(helpers.ajaxResponses.multiplePages);
      if (verificationCallback) {
        verificationCallback(e);
      }
    });
  }

  var processCallbacks = function() {
    return {
      process: function(track, perPage, json) {
        var data = json.data;
        var array = [];

        for (var i = 0; i < perPage; i++) {
          array.push(
            $("<div></div>", {"class": "item"}).
            append($("<img>", {"src": data[i].img_url})).
            append($("<p></p>", {"text": data[i].title}))
          );
        }

        return array;
      },

      updateTotalPages: function(track, json) {
        track.updateTotalPages(json.total_pages);
      }
    }
  }

  var createPlugin = function(opts) {
    return new SilverTrack.Plugins.RemoteContent(
      $.extend(processCallbacks(), opts)
    );
  }

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

    it("should have a default 'ajaxFunction'", function() {
      expect(plugin.options.ajaxFunction).toBe(null);
    });

    it("should have a default 'lazy'", function() {
      expect(plugin.options.lazy).toBe(true);
    });

    it("should have a default 'prefetchPages'", function() {
      expect(plugin.options.prefetchPages).toBe(0);
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

    it("should have a default 'afterAppend'", function() {
      expect(plugin.options.afterAppend).toBeDefined();
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
        plugin = createPlugin({url: "some/url/{page}"});
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
        mockAjaxOnePage();

        spyOn(track, "restart");
        track.install(plugin);
        track.start();
        expect(track.restart).toHaveBeenCalled();
      });

      it("should be marked as 'filled' after loading the content", function() {
        mockAjaxOnePage();

        track.install(plugin);
        expect(plugin.filled).toBe(false);
        track.start();
        expect(plugin.filled).toBe(true);
      });
    });

    describe("when lazy true and prefetchPages > 0", function() {
      beforeEach(function(done) {
        plugin = createPlugin({url: "some/url/{page}", prefetchPages: 2});
        track.install(plugin);
        mockAjaxMultiplePages();
      });

      it("should load the next page in advance", function() {
        expect(plugin.ajaxCache).toEqual({});
        track.start();
        expect(plugin.ajaxCache["some/url/1"]).toBe(true);
        expect(plugin.ajaxCache["some/url/2"]).toBe(true);
        expect(plugin.ajaxCache["some/url/3"]).toBe(true);
      });
    });

    describe("when lazy false", function() {
      beforeEach(function() {
        plugin = createPlugin({lazy: false, url: "some/url/{page}"});
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

      it("should be mark as 'filled'", function() {
        track.install(plugin);
        expect(plugin.filled).toBe(false);
        track.start();
        expect(plugin.filled).toBe(true);
      });
    });

    describe("when ajaxFunction is not defined", function() {
      beforeEach(function() {
        spyOn($, "ajax");
        plugin = new SilverTrack.Plugins.RemoteContent();
      });

      it("should fallback to default jQuery ajax", function() {
        var opts = {a: 1, b: 1};

        plugin.ajaxFunction(opts);
        expect($.ajax).toHaveBeenCalledWith(opts);
      });
    });

    describe("when ajaxFunction is defined", function() {
      var obj;

      beforeEach(function() {
        obj = {customFunction: $.noop};

        spyOn($, "ajax");
        spyOn(obj, "customFunction");

        plugin = createPlugin({ajaxFunction: obj.customFunction});
      });

      it("should use the provided function", function() {
        var opts = {a: 1, b: 1};

        plugin.ajaxFunction(opts);
        expect($.ajax).not.toHaveBeenCalled();
        expect(obj.customFunction).toHaveBeenCalledWith(opts);
      });
    });
  });

  describe("#next", function() {
    describe("common behavior", function() {
      beforeEach(function() {
        plugin = createPlugin({url: "some/url/{page}"});
        track.install(plugin);
        mockAjaxMultiplePages();
      });

      it("should disable the content loader", function() {
        spyOn(track, "goToPage");

        track.start();
        expect(plugin.loadContentEnabled).toBe(true);
        track.next();
        expect(plugin.loadContentEnabled).toBe(false);
      });

      it("should enable the content loader after animation", function() {
        track.start();
        expect(plugin.loadContentEnabled).toBe(true);
        spyOn(plugin, "afterAnimation").andCallThrough();
        track.next();

        expect(plugin.afterAnimation).toHaveBeenCalled();
        expect(plugin.loadContentEnabled).toBe(true);
      });

      it("should call 'goToPage' with the next page", function() {
        var currentPage = track.currentPage;

        spyOn(track, "goToPage");
        track.start();
        track.next();
        expect(track.goToPage).toHaveBeenCalledWith(currentPage + 1);
      });

      describe("when there is only one page", function() {
        it("should get the first page", function() {
          spyOn(track, "goToPage");

          track.start();
          expect(track.goToPage).toHaveBeenCalledWith(track.currentPage, {animate: false});
        });

        it("should not allow the user to go to the next page", function() {
          var currentPage = track.currentPage;

          spyOn(track, "hasNext").andReturn(false);
          spyOn(track, "goToPage");

          // First query
          track.start();
          track.next();

          expect(track.goToPage).not.toHaveBeenCalledWith(currentPage + 1);
          expect(track.currentPage).toEqual(1);
        });
      });
    });

    describe("when loading content", function() {
      describe("and the url is defined by a string", function() {
        beforeEach(function() {
          plugin = createPlugin({url: "some/url/{page}/{perPage}"});
          track.install(plugin);
        });

        it("should replace {page} and {perPage} tokens", function() {
          mockAjaxMultiplePages(function(ajaxSettings) {
            var page = track.currentPage;
            var perPage = track.options.perPage;
            expect(ajaxSettings.url).toBe("some/url/" + page + "/" + perPage);
          });

          track.start();
        });
      });

      describe("and the url is defined by a function", function() {
        beforeEach(function() {
          plugin = createPlugin({
            url: function(track, page, perPage) {
              return "some/url/" + page + "/" + perPage;
            }
          });
          track.install(plugin);
        });

        it("should pass 'page' and 'perPage' as arguments", function() {
          mockAjaxMultiplePages(function(ajaxSettings) {
            var page = track.currentPage;
            var perPage = track.options.perPage;
            expect(ajaxSettings.url).toBe("some/url/" + page + "/" + perPage);
          });

          track.start();
        });
      });

      describe("and the url is in the cache", function() {
        beforeEach(function() {
          plugin = createPlugin({url: "some/url/{page}"});
          plugin.ajaxCache["some/url/1"] = true;
          track.install(plugin);
        });

        it("should not fetch the content", function() {
          spyOn($, "ajax");
          track.start();
          expect($.ajax).not.toHaveBeenCalled();
        });
      });

      describe("and the url is not in the cache", function() {
        var expectAjaxSetting = function(opts) {
          mockAjaxMultiplePages(function(ajaxSettings) {
            expect(ajaxSettings[opts.attr]).toBe(opts.toBe);
          });
          track.start();
        }

        beforeEach(function() {
          plugin = createPlugin({url: "some/url/{page}"});
          track.install(plugin);
        });

        it("should use the proper context", function() {
          expectAjaxSetting({attr: "context", toBe: track.container});
        });

        it("should use the configured type", function() {
          expectAjaxSetting({attr: "type", toBe: plugin.options.type});
        });

        it("should use the configured params", function() {
          plugin.options.params = {1: 2};
          expectAjaxSetting({attr: "data", toBe: plugin.options.params});
        });

        it("should call 'beforeSend'", function() {
          spyOn(plugin.options, "beforeSend").andCallThrough();
          track.start();
          expect(plugin.options.beforeSend).toHaveBeenCalledWith(track, jasmine.any(Object), jasmine.any(Object), {prefetch: false});
        });

        it("should add the url into the cache", function() {
          mockAjaxMultiplePages();
          expect(plugin.ajaxCache["some/url/1"]).toBe(undefined);
          track.start();
          expect(plugin.ajaxCache["some/url/1"]).toBe(true);
        });

        it("should call 'process'", function() {
          mockAjaxMultiplePages();
          spyOn(plugin.options, "process")
          track.start();

          var perPage = track.options.perPage;
          var data = helpers.ajaxResponses.multiplePages;
          expect(plugin.options.process).toHaveBeenCalledWith(track, perPage, data, {prefetch: false});
        });

        it("should call 'beforeAppend'", function() {
          mockAjaxMultiplePages();
          spyOn(plugin.options, "beforeAppend");
          track.start();
          expect(plugin.options.beforeAppend).toHaveBeenCalledWith(track, jasmine.any(Object), {prefetch: false});
        });

        it("should call 'afterAppend'", function() {
          mockAjaxMultiplePages();
          spyOn(plugin.options, "afterAppend");
          track.start();
          expect(plugin.options.afterAppend).toHaveBeenCalledWith(track, jasmine.any(Object), {prefetch: false});
        });

        it("should call 'updateTotalPages'", function() {
          mockAjaxMultiplePages();
          spyOn(plugin.options, "updateTotalPages");
          track.start();

          var data = helpers.ajaxResponses.multiplePages;
          expect(plugin.options.updateTotalPages).toHaveBeenCalledWith(track, data);
        });

        it("should reload the items", function() {
          mockAjaxMultiplePages();
          spyOn(track, "reloadItems");
          track.start();
          expect(track.reloadItems).toHaveBeenCalled();
        });

        it("should call 'goToPage' with the proper page after the request", function() {
          mockAjaxMultiplePages();
          spyOn(track, "goToPage");
          track.start();
          track.next();
          expect(track.goToPage).toHaveBeenCalledWith(track.currentPage + 1);
        });
      });

      describe("and the url is not in the cache and prefetch is enabled", function() {
        beforeEach(function(done) {
          plugin = createPlugin({url: "some/url/{page}", prefetchPages: 2});
          track.install(plugin);
          mockAjaxMultiplePages();
          track.start();
        });

        describe("and there is no more pages to load", function() {
          it("should not try to load anything", function() {
            track.updateTotalPages(3);
            track.next();
            track.next();
            expect(plugin.ajaxFunction.calls.length).toBe(3);
            expect(Object.keys(plugin.ajaxCache).length).toBe(3);
          });
        });

        describe("and prefetch pages was disabled", function() {
          it("should not try to load anything", function() {
            plugin.prefetchEnabled = false;
            track.next();
            track.next();
            expect(plugin.ajaxFunction.calls.length).toBe(3);
            expect(Object.keys(plugin.ajaxCache).length).toBe(3);
          });
        });

        describe("and prefetch pages has an invalid value", function() {
          it("should not try to load anything", function() {
            plugin.options.prefetchPages = false;
            track.next();
            track.next();
            expect(plugin.ajaxFunction.calls.length).toBe(3);
            expect(Object.keys(plugin.ajaxCache).length).toBe(3);
          });
        });

        describe("and has more pages to load", function() {
          it("should load the next pages in advance", function() {
            expect(Object.keys(plugin.ajaxCache).length).toBe(3);
            expect(track.currentPage).toBe(1);
            track.next();
            track.next();
            expect(track.currentPage).toBe(3);
            expect(plugin.ajaxFunction.calls.length).toBe(5);
            expect(Object.keys(plugin.ajaxCache).length).toBe(5);
          });
        });
      });
    });
  });

  describe("#reload", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.RemoteContent({url: "some/url/{page}"});
    });

    describe("defaults", function() {
      beforeEach(function() {
        track.install(plugin);
      });

      it("should restarts the track", function() {
        spyOn(track, "restart");
        plugin.reload();
        expect(track.restart).toHaveBeenCalled();
      });

      it("should reload the track items", function() {
        spyOn(track, "reloadItems");
        plugin.reload();
        expect(track.reloadItems).toHaveBeenCalled();
      });

      it("should empty the track container", function() {
        track.container.append($("<div></div>"));
        expect(track.container.find("div").length).toBe(1);
        plugin.reload();
        expect(track.container.find("div").length).toBe(0);
      });

      it("should empty the ajax cache", function() {
        plugin.ajaxCache["1"] = true;
        plugin.ajaxCache["2"] = true;
        expect(plugin.ajaxCache).not.toEqual({});
        plugin.reload();
        expect(plugin.ajaxCache).toEqual({});
      });

      it("should flag the plugin as unfilled", function() {
        plugin.filled = true;
        expect(plugin.filled).toBe(true);
        plugin.reload();
        expect(plugin.filled).toBe(false);
      });

      it("should flag the plugin as load content enabled", function() {
        plugin.loadContentEnabled = false;
        expect(plugin.loadContentEnabled).toBe(false);
        plugin.reload();
        expect(plugin.loadContentEnabled).toBe(true);
      });
    });

    describe("when lazy true", function() {
      beforeEach(function() {
        plugin.options.lazy = true;
        track.install(plugin);
      });

      it("should fetches the content again", function() {
        mockAjaxOnePage();
        plugin.reload();
        expect(plugin.ajaxFunction).toHaveBeenCalled();
      });
    });

    describe("when lazy false", function() {
      beforeEach(function() {
        plugin.options.lazy = false;
        track.install(plugin);
      });

      it("should not fetch any content", function() {
        mockAjaxOnePage();
        plugin.reload();
        expect(plugin.ajaxFunction).not.toHaveBeenCalled();
      });

      it("should flag the plugin as filled", function() {
        plugin.filled = false;
        expect(plugin.filled).toBe(false);
        plugin.reload();
        expect(plugin.filled).toBe(true);
      });
    });
  });

});
