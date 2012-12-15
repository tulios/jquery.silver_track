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

    next: function() {
      var page = this.currentPage + 1;
      var useCover = this.opts.cover && (this.currentPage === 1);
      var event = {name: "next", page: page, cover: useCover};
      this._paginate(page, event,  function(items) {
        this.currentPage = page;
        return this._calculateWidth(items, useCover) + this._calculateContainerLeft();
      });
    },

    prev: function() {
      var useCover = this.opts.cover && (this.currentPage === 2);
      var event = {name: "prev", page: this.currentPage - 1, cover: useCover};
      this._paginate(this.currentPage, event, function(items) {
        this.currentPage -= 1;
        return this._calculateContainerLeft() - this._calculateWidth(items, useCover);
      });
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

    _executeAll: function(name, args) {
      for (var i = 0; i < this.plugins.length; i++) {
        this._callFunction(this.plugins[i], name, args);
      }
    },

    _positionElements: function() {
      var self = this;
      this.container.css({"left": "0px"});
      this.itemWidth = this._calculateItemWidth();
      this.coverWidth = this._calculateCoverWidth();

      var width = 0;
      this._items(true).each(function(index, value) {
        var item = $(value);
        item.css({"left": width + "px"});
        width += item.outerWidth(true);
      });
    },

    _callFunction: function(obj, name, args) {
      if(obj && name && typeof obj[name] === 'function') {
        obj[name].apply(obj, [this].concat(args || []));
      }
    },

    _calculateTotalPages: function() {
      this.totalPages = Math.ceil(this._items().length/this.opts.perPage);

      if (this.opts.cover) {
        this.totalPages += 1;
      }
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

    _animate: function(shift) {
      var self = this;
      this._executeAll("beforeAnimation");
      this.container.animate({"left": "-" + shift + "px"}, "slow", function() {
        self.paginationEnabled = true;
        self._executeAll("afterAnimation");
      });
    },

    _calculateContainerLeft: function() {
      return Math.abs(parseInt(this.container.css("left"), 10));
    },

    _calculateItemsForPagination: function(page) {
      var delta = this.opts.cover ? (page - 1) * this.opts.perPage : page * this.opts.perPage;
      return this._items().slice(delta - this.opts.perPage, delta);
    },

    _items: function(ignoreCoverFilter) {
      var items = $("." + this.opts.itemClass, this.container);
      return !ignoreCoverFilter && this.opts.cover ? items.not(":first") : items;
    },

    _getCover: function() {
      return $("." + this.opts.itemClass + ":first", this.container);
    },

    _calculateWidth: function(items, isCover) {
      if (this.opts.cover && isCover) {
        return this.coverWidth;
      }

      return items.length * this.itemWidth;
    },

    _calculateItemWidth: function() {
      return $("." + this.opts.itemClass).not("." + this.opts.coverClass).outerWidth(true);
    },

    _calculateCoverWidth: function() {
      return this.opts.cover ? this._getCover().outerWidth(true) : 0;
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
