/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.3.0
 *
 * SilverTrack Recipes
 * version: 0.1.0
 */

(function ($, window, document) {

  if (!window.SilverTrack) {
    return;
  }

  SilverTrack.Recipes = {};
  SilverTrack.Factory = function(element, options) {
    this.element = element;
    this.options = $.extend({}, options);
  }

  SilverTrack.Factory.prototype = {
    track: null,

    create: function(configCallback) {
      configCallback(this.externalInterface());
      return this.track;
    },

    externalInterface: function() {
      var self = this;
      var defaultTrack = function() {
        if (!self.track) {
          self.track = self.element.silverTrack();
        }
      }

      return {
        createTrack: function(callback) {
          if (callback !== undefined) {
            self.track = callback(self.element, self.options);
          }
          defaultTrack();
        },

        installPlugins: function(callback) {
          defaultTrack();
          if (callback !== undefined) {
            callback(self.track, self.options);
          }
        }
      }
    }
  }

  $.silverTrackRecipes = function(recipeName, configCallback) {
    SilverTrack.Recipes[recipeName] = function(element, options) {
      return new SilverTrack.Factory(element, options).create(configCallback);
    }
  }

  $.silverTrackRecipes.create = function(recipeName, element, options) {
    return SilverTrack.Recipes[recipeName](element, options);
  }

})(jQuery, window, document);
