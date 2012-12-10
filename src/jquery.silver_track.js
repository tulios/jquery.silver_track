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
      this._paginate(page, useCover, {name: "next", page: page},  function(items) {
        this.currentPage = page;
        return this._calculateWidth(items, useCover) + this._calculateContainerLeft();
      });
    },

    prev: function() {
      var useCover = this.opts.cover && (this.currentPage === 2);
      this._paginate(this.currentPage, useCover, {name: "prev", page: this.currentPage - 1}, function(items) {
        this.currentPage -= 1;
        return this._calculateContainerLeft() - this._calculateWidth(items, useCover);
      });
    },

    install: function(plugin) {
      this.plugins.push(plugin);
      this._callFunction(plugin, "onInstall");
      return this;
    },

    _init: function() {
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

    _paginate: function(newPage, useCover, event, calculateShift) {
      if (!this.paginationEnabled || (newPage <= this.currentPage && this.currentPage === 1)) {
        return;
      }

      this._executeAll("beforePagination", [event.name, event.page, useCover]);
      var items = useCover ? this._getCover() : this._calculateItemsForPagination(newPage);
      if (items.length > 0) {
        this.paginationEnabled = false;
        var shift = calculateShift.call(this, items);
        this._animate(shift);
      }
    },

    _animate: function(shift) {
      var self = this;
      this._executeAll("beforeAnimate");
      this.container.animate({"left": "-" + shift + "px"}, "slow", function() {
        self.paginationEnabled = true;
        self._executeAll("afterAnimate");
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

  SilverTrack.Plugin = function(){};
  SilverTrack.Plugin.prototype = {
    onInstall: function(track) {},
    beforeStart: function(track) {},
    afterStart: function(track) {},
    beforeAnimate: function(track) {},
    afterAnimate: function(track) {},
    beforePagination: function(track, direction, page, useCover) {}
  }

  window.SilverTrack = SilverTrack;
  window.SilverTrack = SilverTrack.Plugin;

})(jQuery, window, document);
