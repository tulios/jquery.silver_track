describe("SilverTrack.Plugins.BulletNavigator", function() {
  var track = null;
  var plugin = null;
  var getBullets = function(plugin, track) {
    return $(".bullet-pagination ." + plugin.options.bulletClass, track.container.parent());
  }

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");

    $.fx.off = true;

    track = helpers.basic();
  });

  describe("defaults", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.BulletNavigator();
    });

    it("should have a default 'bulletClass'", function() {
      expect(plugin.options.bulletClass).toBe("bullet");
    });

    it("should have a default 'activeClass'", function() {
      expect(plugin.options.activeClass).toBe("active");
    });
  });

  describe("bullet creation", function() {
    var bullets = null;

    beforeEach(function() {
      plugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(plugin);
      track.start();

      bullets = getBullets(plugin, track);
    });

    it("should create the bullets based on totalPages", function() {
      expect(bullets.length).toBe(track.totalPages);
    });

    it("should add a data-page with the page number", function() {
      for (var i = 1; i <= track.totalPages; i++) {
        expect($(bullets[i - 1]).data("page")).toBe(i);
      }
    });

    it("should add the active class to the first bullet", function() {
      expect($(bullets[0]).hasClass(plugin.options.activeClass)).toBe(true);
    });

    it("should bind the click to the bullet page", function() {
      spyOn(track, "goToPage");
      var bullet = $(bullets[1]); // 2º
      bullet.click();
      expect(track.goToPage).toHaveBeenCalledWith(bullet.data("page"));
    });

    it("should add the active class to the clicked bullet", function() {
      var bullet = $(bullets[1]); // 2º
      bullet.click();
      expect(bullet.hasClass(plugin.options.activeClass)).toBe(true);
    });
  });

  describe("when totalPages is updated", function() {
    var bullets = null;

    beforeEach(function() {
      plugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(plugin);
      track.start();

      bullets = getBullets(plugin, track);
    });

    it("should clear previous bullets", function() {
      expect(bullets.length).toBe(3);
      track.updateTotalPages(0);

      bullets = getBullets(plugin, track);
      expect(bullets.length).toBe(0);
    });

    it("should recreate the bullets based on the new totalPages", function() {
      expect(bullets.length).toBe(3);
      track.updateTotalPages(1);

      bullets = getBullets(plugin, track);
      expect(bullets.length).toBe(1);
    });

    it("should remove the goToPage from the click event", function() {
      spyOn(track, "goToPage");
      track.updateTotalPages(1);

      var bullet = $(getBullets(plugin, track)[0]);
      bullet.click();
      expect(track.goToPage).not.toHaveBeenCalled();
    });
  });

  describe("after restart", function() {
    var bullets = null;

    beforeEach(function() {
      plugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(plugin);
      track.start();

      bullets = getBullets(plugin, track);
    });

    it("should recreate the bullets based on the new track attributes", function() {
      track.options.perPage = 1;
      track.restart();
      bullets = getBullets(plugin, track);
      expect(bullets.length).toBe(9);
    });

    it("should setup the click of the new bullets", function() {
      spyOn(plugin, "_setupBulletClick").andCallThrough();
      track.restart();
      bullets = getBullets(plugin, track);
      expect(bullets.length).toBe(3);
      expect(plugin._setupBulletClick).toHaveBeenCalled();
    });

    it("should add the active class to the 'currentPage' bullet", function() {
      track.currentPage = 3;
      track.restart({keepCurrentPage: true});

      var bullet = $(bullets[2]); // 3º
      expect(bullet.hasClass(plugin.options.activeClass)).toBe(true);
    });
  });

  describe("after animation", function() {
    var bullets = null;

    beforeEach(function() {
      plugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(plugin);
      track.start();

      bullets = getBullets(plugin, track);
    });

    it("should call '_setupBulletClick'", function() {
      spyOn(plugin,"_setupBulletClick");
      plugin.afterAnimation();
      expect(plugin._setupBulletClick).toHaveBeenCalled();
    });

    it("should able bullet click", function() {
      var bullet1 = $(bullets[0]);
      var bullet2 = $(bullets[1]);

      bullet2.click();
      plugin.afterAnimation();
      bullet1.click();

      expect(track.currentPage).toBe(1);
      expect(bullet1.hasClass(plugin.options.activeClass)).toBe(true);
      expect(bullet2.hasClass(plugin.options.activeClass)).toBe(false);
    });
  });

  describe("click behavior", function() {
    beforeEach(function() {
      plugin = new SilverTrack.Plugins.BulletNavigator({
        container: $(".bullet-pagination", track.container.parent())
      });

      track.install(plugin);
      track.start();

      bullets = getBullets(plugin, track);
    });

    it("should disable bullet click during page transition", function() {
      var bullet1 = $(bullets[0]);
      var bullet2 = $(bullets[1]);

      expect(track.currentPage).toBe(1);
      bullet2.click();
      expect(track.currentPage).toBe(2);
      bullet1.click();

      expect(track.currentPage).toBe(2);
      expect(bullet2.hasClass(plugin.options.activeClass)).toBe(true);
      expect(bullet1.hasClass(plugin.options.activeClass)).toBe(false);
    });
  })
});
