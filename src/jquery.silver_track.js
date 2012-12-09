/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.1.0
 */

(function ($, window, document) {

  var instanceName = "silverTrackInstance";

  $.fn.silverTrack = function(opts) {
    var container = $(this);

    if (!container.data(instanceName)) {
      var opts = $.extend({}, $.fn.silverTrack.options, opts);
      var instance = new SilverTrack(container, opts);
      container.data(instanceName, instance);
      return instance;
    }

    return container.data(instanceName);
  };

  $.fn.silverTrack.options = {
    perPage: 4,
    itemClass: "item"
  };

  var SilverTrack = function (container, opts) {
    this.opts = opts;
    this.container = container;

    this.paginationEnabled = true;
    this.currentPage = 1;

    this.itemWidth = this._calculateItemWidth();
    this._init();
  };

  SilverTrack.prototype = {

    next: function() {
      var page = this.currentPage + 1;
      this._paginate(page, function(items) {
        this.currentPage = page;
        return (items.length * this.itemWidth) + this._calculateContainerLeft();
      });
    },

    prev: function() {
      this._paginate(this.currentPage, function(items) {
        this.currentPage -= 1;
        return this._calculateContainerLeft() - (items.length * this.itemWidth);
      });
    },

    _init: function() {
      var self = this;
      this.container.css({"left": "0px"});

      this._items().each(function(index, value) {
        $(value).css({"left": (self.itemWidth * index) + "px"});
      });
    },

    _paginate: function(newPage, calculateShift) {
      if (!this.paginationEnabled || (newPage <= this.currentPage && this.currentPage === 1)) {
        return;
      }

      var items = this._calculateItemsForPagination(newPage);
      if (items.length > 0) {
        this.paginationEnabled = false;
        var shift = calculateShift.call(this, items);
        this._animate(shift);
      }
    },

    _animate: function(shift) {
      var self = this;
      this.container.animate({"left": "-" + shift + "px"}, "slow", function() {
        self.paginationEnabled = true;
      });
    },

    _calculateContainerLeft: function() {
      return Math.abs(parseInt(this.container.css("left"), 10));
    },

    _calculateItemsForPagination: function(page) {
      var delta = (page * this.opts.perPage);
      return this._items().slice(delta - this.opts.perPage, delta);
    },

    _items: function() {
      return $("." + this.opts.itemClass, this.container);
    },

    _calculateItemWidth: function() {
      return $("." + this.opts.itemClass + ":first", this.container).outerWidth(true);
    }

  }

})(jQuery, window, document);
