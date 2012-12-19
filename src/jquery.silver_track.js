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
    itemClass: "item",
    cover: false
  };

  var SilverTrack = function (container, opts) {
    this.opts = opts;
    this.container = container;
    this.paginationEnabled = true;
    this.currentPage = 1;
    this.totalPages = null;
    this.plugins = [];
  };

  SilverTrack.prototype = {

    start: function() {
      this._executeAll("beforeStart");
      this._init();
      this._executeAll("afterStart");
    },

    goToPage: function(page) {
      if (!this.paginationEnabled ||
          (page <= this.currentPage && this.currentPage === 1) ||
          page > this.totalPages ||
          page === this.currentPage) {
        return;
      }

      var useCover = this.opts.cover && (page === 1);
      var direction = page > this.currentPage ? "next" : "prev";
      var items = useCover ? this._getCover() : this._calculateItemsForPagination(page);

      if (items.length > 0) {
        var shift = this._calculateItemLeft(items.get(0));
        if (items.length < this.opts.perPage && !useCover) {
          shift -= this.itemWidth * (this.opts.perPage - items.length);
        }

        this.currentPage = page;
        this._executeAll("beforePagination", [{
          name: direction,
          page: page,
          cover: useCover
        }]);

        this.paginationEnabled = false;
        this._animate(shift);
      }
    },

    next: function() {
      this.goToPage(this.currentPage + 1);
    },

    prev: function() {
      this.goToPage(this.currentPage - 1);
    },

    hasPrev: function() {
      return !(this.currentPage === 1);
    },

    hasNext: function() {
      return !(this.currentPage === this.totalPages);
    },

    restart: function() {
      this.paginationEnabled = true;
      this.currentPage = 1;
      this._init();
      this._executeAll("afterRestart");
    },

    install: function(plugin) {
      this.plugins.push(plugin);
      this._callFunction(plugin, "onInstall");
      return this;
    },

    _init: function() {
      this._positionElements();
      this._calculateTotalPages();
    },

    _paginate: function(newPage, event, calculateShift) {
      if (!this.paginationEnabled || (newPage <= this.currentPage && this.currentPage === 1)) {
        return;
      }

      this._executeAll("beforePagination", [event]);
      var items = event.cover ? this._getCover() : this._calculateItemsForPagination(newPage);
      if (items.length > 0) {
        this.paginationEnabled = false;
        var shift = calculateShift.call(this, items);
        this._animate(shift);
      }
    },

    _getItems: function(ignoreCoverFilter) {
      if (!this._items) {
        this._items = $("." + this.opts.itemClass, this.container);
      }

      return !ignoreCoverFilter && this.opts.cover ? this._items.not(":first") : this._items;
    },

    _getCover: function() {
      return $("." + this.opts.itemClass + ":first", this.container);
    },

    _animate: function(shift) {
      var self = this;
      this._executeAll("beforeAnimation");
      this.container.animate({"left": "-" + shift + "px"}, "slow", function() {
        self.paginationEnabled = true;
        self._executeAll("afterAnimation");
      });
    },

    _positionElements: function() {
      var self = this;
      this.container.css({"left": "0px"});
      this.itemWidth = this._calculateItemWidth();
      this.coverWidth = this._calculateCoverWidth();

      var width = 0;
      this._getItems(true).each(function(index, value) {
        var item = $(value);
        item.css({"left": width + "px"});
        width += item.outerWidth(true);
      });
    },

    _calculateTotalPages: function() {
      this.totalPages = Math.ceil(this._getItems().length/this.opts.perPage);

      if (this.opts.cover) {
        this.totalPages += 1;
      }
    },

    _calculateContainerLeft: function() {
      return this._abs(this.container.css("left"));
    },

    _calculateItemLeft: function(item) {
      return this._abs($(item).css("left"));
    },

    _calculateItemsForPagination: function(page) {
      var delta = this.opts.cover ? (page - 1) * this.opts.perPage : page * this.opts.perPage;
      return this._getItems().slice(delta - this.opts.perPage, delta);
    },

    _calculateWidth: function(items, isCover) {
      if (this.opts.cover && isCover) {
        return this.coverWidth;
      }

      return items.length * this.itemWidth;
    },

    _calculateItemWidth: function() {
      var complement = this.opts.cover ? ":eq(1)" : ":first";
      var item = $("." + this.opts.itemClass + complement, this.container);
      return item.outerWidth(true);
    },

    _calculateCoverWidth: function() {
      return this.opts.cover ? this._getCover().outerWidth(true) : 0;
    },

    _executeAll: function(name, args) {
      for (var i = 0; i < this.plugins.length; i++) {
        this._callFunction(this.plugins[i], name, args);
      }
    },

    _callFunction: function(obj, name, args) {
      if(obj && name && typeof obj[name] === 'function') {
        obj[name].apply(obj, [this].concat(args || []));
      }
    },

    _abs: function(string) {
      return Math.abs(parseInt(string, 10));
    }

  }

  SilverTrack.Plugins = {};

  $.silverTrackPlugin = function(name, obj) {
    SilverTrack.Plugins[name] = function(settings){
      this.options = $.extend({}, this.defaults, settings);
      this.constructor();
    };

    SilverTrack.Plugins[name].prototype = $.extend({
      defaultOptions: {},
      constructor: function() {},

      onInstall: function(track) {},
      beforeStart: function(track) {},
      afterStart: function(track) {},
      afterRestart: function(track) {},
      beforeAnimation: function(track) {},
      afterAnimation: function(track) {},

      /* Event format
       *  {
       *    name: "prev", // or "next"
       *    page: 1,
       *    cover: false
       *  }
       */
      beforePagination: function(track, event) {}
    }, obj);
  }

  window.SilverTrack = SilverTrack;

})(jQuery, window, document);
