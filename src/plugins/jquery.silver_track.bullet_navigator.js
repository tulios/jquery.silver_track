/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * Bullet Navigator
 * version: 0.1.1
 *
 */
(function($, window, document) {

  /*
   * track.install(new SilverTrack.Plugins.BulletNavigator({
   *   container: $(".bullet-pagination")
   * }));
   *
   */
  $.silverTrackPlugin("BulletNavigator", {
    defaults: {
      bulletClass: "bullet",
      activeClass: "active"
    },

    initialize: function(options) {
      this.track = null;
      this.options = options;
      this.container = this.options.container;
    },

    onInstall: function(track) {
      this.track = track;
    },

    afterStart: function() {
      this._createBullets();
      this._getBulletByPage(1).addClass(this.options.activeClass);
      this._setupBulletClick();
    },

    afterAnimation: function() {
      this._setupBulletClick();
    },

    beforePagination: function(track, event) {
      var bullet = this._getBulletByPage(event.page);
      this._updateBullets(bullet);
    },

    afterRestart: function() {
      this._clearBullets();
      this._createBullets();

      var bullet = this._getBulletByPage(this.track.currentPage);
      this._updateBullets(bullet);
      this._setupBulletClick();
    },

    onTotalPagesUpdate: function() {
      this._clearBullets();
      this._createBullets();
      this._getBullets().click(function(e) {
        e.preventDefault();
      });
    },

    _clearBullets: function() {
      $("." + this.options.bulletClass, this.container).remove();
    },

    _createBullets: function() {
      for (var i = 0; i < this.track.totalPages; i++) {
        this.container.append(this._createBullet(i + 1));
      }
    },

    _setupBulletClick: function() {
      var self = this;
      var bullets = this._getBullets();
      bullets.click(function(e) {
        e.preventDefault();
        var bullet = $(this);
        self._updateBullets(bullet);
        self.track.goToPage(bullet.data("page"));
        bullets.unbind("click");
      });
    },

    _updateBullets: function(bullet) {
      this._getBullets().removeClass(this.options.activeClass);
      bullet.addClass(this.options.activeClass);
    },

    _getBulletByPage: function(page) {
      return $("." + this.options.bulletClass + "[data-page='" + page + "']", this.container);
    },

    _getBullets: function() {
      return $("." + this.options.bulletClass, this.container);
    },

    _createBullet: function(page) {
      return $("<a></a>", {"class": this.options.bulletClass, "data-page": page, "href": "#"});
    }

  });

})(jQuery, window, document);
