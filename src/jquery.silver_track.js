/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.1.0
 */

(function ($, window, document) {

  var instanceName = "silverTrackInstance";

  $.fn.silverTrack = function(options) {
    var container = $(this);

    if (!container.data(instanceName)) {
      var options = $.extend({}, $.fn.silverTrack.options, options);
      var instance = new SilverTrack(container, options);
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

  var SilverTrack = function (container, options) {
    this.options = options;
    this.container = container;
    this.paginationEnabled = true;
    this.calculateTotalPages = true;
    this.currentPage = 1;
    this.totalPages = 1;
    this.plugins = [];

    this._items = null;
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

      var useCover = this.options.cover && (page === 1);
      var direction = page > this.currentPage ? "next" : "prev";
      var items = useCover ? this._getCover() : this._calculateItemsForPagination(page);

      if (items.length > 0) {
        var shift = this._calculateItemLeft(items.get(0));
        if (items.length < this.options.perPage && !useCover) {
          shift -= this.itemWidth * (this.options.perPage - items.length);
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

    reloadItems: function() {
      this._items = null;
    },

    updateTotalPages: function(totalPages) {
      this.calculateTotalPages = false;
      this.totalPages = this._abs(totalPages);
      this._executeAll("onTotalPagesUpdate");
    },

    _init: function() {
      this._positionElements();
      if (this.calculateTotalPages) {
        this._calculateTotalPages();
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

    _getItems: function(ignoreCoverFilter) {
      if (!this._items) {
        this._items = $("." + this.options.itemClass, this.container);
      }

      return !ignoreCoverFilter && this.options.cover ? this._items.not(":first") : this._items;
    },

    _getCover: function() {
      return $("." + this.options.itemClass + ":first", this.container);
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
      this.totalPages = Math.ceil(this._getItems().length/this.options.perPage);

      if (this.options.cover) {
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
      var delta = this.options.cover ? (page - 1) * this.options.perPage : page * this.options.perPage;
      return this._getItems().slice(delta - this.options.perPage, delta);
    },

    _calculateWidth: function(items, isCover) {
      if (this.options.cover && isCover) {
        return this.coverWidth;
      }

      return items.length * this.itemWidth;
    },

    _calculateItemWidth: function() {
      var complement = this.options.cover ? ":eq(1)" : ":first";
      var item = $("." + this.options.itemClass + complement, this.container);
      return item.outerWidth(true);
    },

    _calculateCoverWidth: function() {
      return this.options.cover ? this._getCover().outerWidth(true) : 0;
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
      var options = $.extend({}, this.defaults, settings);
      this.constructor(options);
    };

    SilverTrack.Plugins[name].prototype = $.extend({
      defaults: {},
      constructor: function(options) {},

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
      beforePagination: function(track, event) {},
      onTotalPagesUpdate: function(track){}
    }, obj);
  }

  window.SilverTrack = SilverTrack;

})(jQuery, window, document);
