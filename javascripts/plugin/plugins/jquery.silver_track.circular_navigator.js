/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * Circular Navigator
 * version: 0.1.0
 *
 */

(function($, window, document) {

  $.silverTrackPlugin("CircularNavigator", {
    defaults: {
      autoPlay: false,
      duration: 3000,
      clonedClass: "cloned"
    },

    initialize: function(options) {
      this.options = options;
    },

    onInstall: function(track) { 
      this.track = track;
    },

    afterStart: function(track) {
      var perPage = this.track.options.perPage;

      this.itemsCount = this.track._getItems().length;
      this.numLastItems = this.itemsCount % perPage;
      this.totalDefaultPages = this.track.totalPages;
      this.goingLeft = false;

      this.fowardPage = this.track.currentPage;
      this._changeFowardPage();
      this.navigatorPlugin = this.track.findPluginByName("Navigator");

      this._listenClick();

      this.breakPlayElements = [
        this.track.container,
        this.navigatorPlugin.prev,
        this.navigatorPlugin.next
      ]

      this.prevButton = this.breakPlayElements[1];
      this.nextButton = this.breakPlayElements[2];

      if(this.options.autoPlay === true) {
        this._turnOnAutoPlay(this.breakPlayElements)
      }

      if (this.numLastItems === 0) {
        this.numLastItems = this.track.options.perPage;
      }

      if (this._hasManyPages()) {
        this.beforePagination();
        this.afterAnimation();
      }
    },

    afterRestart: function() {
      if (this._hasManyPages()) {
        this._enableButtons();
      }

      if (this.track.currentPage === this.totalDefaultPages + 1 &&
          this.goingLeft === true) {
        this.track.goToPage(this.track.totalPages - 1);
        this.goingLeft = false;
      }
    },

    beforePagination: function() {
      if (this.track.currentPage === this._lastCompletedPage() &&
          this.track.totalPages === this.totalDefaultPages) {

        this._appendItems();
        this.track.reloadItems();
      }
    },

    afterAnimation: function() {
      this._enableButtons();
      this._changeFowardPage();

      if (this.track.currentPage === this._lastCompletedPage() &&
          this.track.totalPages === this.totalDefaultPages) {

        this.track.restart({ keepCurrentPage: true, animate: false });
      }

      if (this.track.currentPage === this.track.totalPages && 
          this.track.totalPages > this.totalDefaultPages && 
          this.goingLeft === false ) {

        this.track.reloadItems();
        this.track.restart({page: 1, animate: false});
        this._deleteClonedItems();
      }
    },

    _listenClick: function() {
      var self = this
      this.navigatorPlugin.options.prev.click(function() {
        if (self.track.currentPage === 1 &&
            self.fowardPage === self.totalDefaultPages) {
          self._appendItems();
          self.goingLeft = true;
          self.track.restart({ page: self.totalDefaultPages + 1, animate: false });
        }
      })
    },

    _deleteClonedItems: function() {
      var items = this.track._getItems().length

      for (var el = 0; el <= items - 1; el ++) {
        var item = this.track._getItems().eq(el)
        if (item.hasClass(this.options.clonedClass)) {
          item.remove();
        }
      }
      this.track.reloadItems();
      this.track.restart({ keepCurrentPage: true, animate: false });
    },

    _ifCloned: function() {
      if (this.track._getItems().last().hasClass(this.options.clonedClass)) {
        return true;
      }
      return false;
    },

    _appendItems: function() {
      if (this._ifCloned() === true) return;
      var items = this.track._getItems().
        slice(0, 4).
        clone().
        addClass(this.options.clonedClass);

      this.track.container.append(items);
      this.track.reloadItems();
    },

    _lastCompletedPage: function() {
      return Math.trunc(this.itemsCount / this.track.options.perPage);
    },

    _enableButtons: function() {
      if (this.track.currentPage === 1) {
        this._enablePrevButton();
      }

      if (this.track.currentPage === this.track.totalPages) {
        this._enableNextButton();
      }
    },

    _enablePrevButton: function() {
      this.prevButton.removeClass(this.navigatorPlugin.options.disabledClass);
    },

    _enableNextButton: function() {
      this.nextButton.removeClass(this.navigatorPlugin.options.disabledClass);
    },

    _hasManyPages: function() {
      if (this.track.totalPages !== 1) {
        return true;
      }
      return false;
    },

    _changeFowardPage: function(){
      this.fowardPage = this.track.currentPage;
      if (this.track.currentPage === 1) {
        this.fowardPage = this.totalDefaultPages;

      } else if (this.track.currentPage === this.totalDefaultPages &&
                 this.track.totalPages > this.totalDefaultPages) {
        this.fowardPage = 1;
      }
    },

    _turnOnAutoPlay: function(elements) {
      this._mouseOverTrack(elements);
      this._mouseOutTrack(elements);
      this._turnOnListener();
    },

    _turnOnListener: function() {
      var self = this;

      if(this.options.autoPlay === true) {
        timeout = setTimeout(function() {
          self.track.next();
          self._turnOnListener();
        }, this.options.duration);
      }
    },

    _breakListener: function() {
      clearTimeout(timeout);
      this.options.autoPlay = false;
    },

    _wakeUpListener: function() {
      clearTimeout(timeout);
      this.options.autoPlay = true;
      this._turnOnListener();
    },

    _mouseOverTrack: function(elements) {
      var self = this;

      elements.forEach(function(el) {
        el.mouseenter(function() {
          self._breakListener();
        });
      });
    },

    _mouseOutTrack: function(elements) {
      var self = this;

      elements.forEach(function(el) {
        el.mouseleave(function() {
          self._wakeUpListener();
        });
      });
    }
  })

})(jQuery, window, document);