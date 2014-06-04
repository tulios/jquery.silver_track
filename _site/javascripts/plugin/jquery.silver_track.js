/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 */

(function ($, window, document) {

  var instanceName = "silverTrackInstance";

  $.fn.silverTrack = function(options) {
    var container = $(this);

    if (!container.data(instanceName)) {
      options = $.extend({}, $.fn.silverTrack.options, options);
      var instance = new SilverTrack(container, options);
      container.data(instanceName, instance);
      return instance;
    }

    return container.data(instanceName);
  };

  $.fn.silverTrack.options = {
    perPage: 4,
    itemClass: "item",
    mode: "horizontal",
    autoHeight: false,
    cover: false,
    duration: 600,
    easing: "swing",
    /*
     * Args: movement, duration, easing, afterCallback
     * - easing and afterCallback may be optional
     * - movement will be {left: someValue} or {height: someValue}
     */
    animateFunction: null
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
      if (this.options.animateFunction === null) {
        this._validateAnimationEasing();
      }

      this._executeAll("beforeStart");
      this._init();
      this._executeAll("afterStart");
    },

    /*
     * page: Number
     * opts: {animate: true|false}
     */
    goToPage: function(page, opts) {
      opts = $.extend({animate: true}, opts);

      var duration = opts.animate ? this.options.duration : 0;
      var useCover = this.options.cover && (page === 1);
      var direction = page > this.currentPage ? "next" : "prev";
      var items = useCover ? this._getCover() : this._calculateItemsForPagination(page);
      var isHorizontal = this.options.mode === "horizontal";

      if (!this._canPaginate(page)) {
        return;
      }

      if (items.length > 0) {
        var shift = this._calculateItemLeft(items.get(0));
        var event = {name: direction, page: page, cover: useCover, items: items};

        if (items.length < this.options.perPage && !useCover && isHorizontal) {
          shift -= this.itemWidth * (this.options.perPage - items.length);
        }

        this.currentPage = page;
        this._executeAll("beforePagination", [event]);
        this.paginationEnabled = false;

        this._slide(shift, event, duration);
        this._adjustHeight(items, duration);
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
      return !(this.currentPage === this.totalPages || this.totalPages <= 1);
    },

    /*
     * {
     *  page: Number,                // default: 1
     *  keepCurrentPage: true|false, // default: false
     *  animate: true|false          // default: false
     * }
     */
    restart: function(opts) {
      opts = $.extend({
        page: 1,
        keepCurrentPage: false,
        animate: false
      }, opts);

      if (opts.keepCurrentPage) {
        opts.page = this.currentPage;
      }

      this.container.css("height", "");
      this._getItems(true).css("top", "");

      this.paginationEnabled = true;
      this.currentPage = 1;

      this._init();
      this.goToPage(opts.page, {animate: opts.animate});
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

    findPluginByName: function(name) {
      for (var i = 0; i < this.plugins.length; i++) {
        var plugin = this.plugins[i];
        if (plugin.PluginName === name) {
          return plugin;
        }
      }

      return null;
    },

    _init: function() {
      this._positionElements();
      if (this.calculateTotalPages) {
        this._calculateTotalPages();
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

    _canPaginate: function(page) {
      if (!this.paginationEnabled || page > this.totalPages || page < 1) {
        return false;
      }

      return true;
    },

    _slide: function(shift, event, duration) {
      var self = this;
      var movement = {"left": "-" + shift + "px"};
      var afterCallback = function() {
        self.paginationEnabled = true;
        self._executeAll("afterAnimation", [event]);
      }

      this._executeAll("beforeAnimation", [event]);
      this._animate(movement, duration, afterCallback)
    },

    _adjustHeight: function(items, duration) {
      if (this.options.autoHeight === true) {
        var newHeight = 0;

        if (this.options.mode === "horizontal") {
          newHeight = $(items[0]).outerHeight(true);

        } else if (this.options.mode === "vertical") {
          items.each(function(index, value) {
            newHeight += $(value).outerHeight(true);
          });
        }

        var event = {items: items, newHeight: newHeight};
        this._executeAll("beforeAdjustHeight", [event]);
        this._animate({"height": newHeight + "px"}, duration);
        this._executeAll("afterAdjustHeight", [event]);
      }
    },

    _animate: function(movement, duration, afterCallback) {
      var easing = this.options.easing;
      if (this.options.animateFunction !== null) {
        this.options.animateFunction(movement, duration, easing, afterCallback);

      } else {
        this.container.animate(movement, duration, easing, afterCallback);
      }
    },

    _positionElements: function() {
      this.container.css({"left": "0px"});
      this.itemWidth = this._calculateItemWidth();
      this.coverWidth = this._calculateCoverWidth();

      if (this.options.mode === "horizontal") {
        this._positionHorizontal();

      } else if (this.options.mode === "vertical") {
        this._positionVertical();
      }
    },

    _positionHorizontal: function() {
      var width = 0;
      this._getItems(true).each(function(index, value) {
        var item = $(value);
        item.css({"left": width + "px"});
        width += item.outerWidth(true);
      });

      this.container.css("width", width + "px");
    },

    _positionVertical: function() {
      var width = 0;
      var height = 0;

      var perPage = this.options.perPage;
      var useCover = this.options.cover;
      var pageItem = 0;

      this._getItems(true).each(function(index, value) {
        var item = $(value);
        item.css({"top": height + "px", "left": width + "px"});
        pageItem++;

        if (pageItem === perPage || (useCover && index === 0)) {
          pageItem = 0;
          height = 0;
          width += item.outerWidth(true);

        } else {
          height += item.outerHeight(true);
        }
      });

      this.container.css("width", width + this.itemWidth + "px");
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

    _validateAnimationEasing: function() {
      var easingFuctionExists = !!($.easing && $.easing[this.options.easing]);

      if (!easingFuctionExists) {
        this.options.easing = $.fn.silverTrack.options.easing;
      }
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
      this.PluginName = name;
      this.initialize(options);
    };

    SilverTrack.Plugins[name].prototype = $.extend({
      defaults: {},
      initialize: function(options) {},

      onInstall: function(track) {},
      beforeStart: function(track) {},
      afterStart: function(track) {},
      afterRestart: function(track) {},
      onTotalPagesUpdate: function(track){},

      /* Event format
       *  {
       *    name: "prev", // or "next"
       *    page: 1,
       *    cover: false,
       *    items: []
       *  }
       */
      beforeAnimation: function(track, event) {},
      afterAnimation: function(track, event) {},
      beforePagination: function(track, event) {},

      /* Event format
       *  {
       *    items: [],
       *    newHeight: 150
       *  }
       */
      beforeAdjustHeight: function(track, event) {},
      afterAdjustHeight: function(track, event) {}
    }, obj);
  }

  window.SilverTrack = SilverTrack;

})(jQuery, window, document);
