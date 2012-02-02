/**
* Thermometer - jQuery plugin which helps turns any list into
* a nice looking progress thermometer
*
* Source Code: https://github.com/coryschires/thermometer
*
* Copyright (c) 2011 Cory Schires (coryschires.com)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Version: 0.1.0
*/


(function($) {

  $.thermometer = {
    defaults: {
      title_markup: false,     // if false, then uses the text of the currently active step (i.e. li.active)
      active_class: 'active',  // in case you're using something different for your active class (e.g. current)
      animate: false           // animate the thermometer on page load
    }
  }

  $.fn.thermometer = function(method) {

    var config = $.extend({}, $.thermometer.defaults, method);

    var methods = {

      init : function(config) {

        return this.each(function() {

          var thermometer = $(this).addClass('thermometer');

          // Add stuff to the DOM
          thermometer.wrap('<div class="thermometer_wrapper"></div>');
          thermometer.before('<h4 class="thermometer_current_status"></h4>');
          thermometer.prepend('<div class="progress_bar_wrapper"><div class="progress_bar"></div></div>');

          // Create the thermometer
          helpers.build_thermometer_title(thermometer);
          helpers.build_progress_bar(thermometer);
        });
      },

      // public methods
      update_active_state: function() {
        helpers.build_thermometer_title(this);
        helpers.build_progress_bar(this);
      }
    }
    // private_methods
    var helpers = {
      active_step: function(thermometer) {
        return thermometer.find('.' + config.active_class);
      },
      build_thermometer_title: function(thermometer) {
        var title = thermometer.prev();
        var text = helpers.active_step(thermometer).text();
        var markup = config.title_markup ? config.title_markup.replace(/{{active}}/, text) : text;
        title.html(markup);
      },
      build_progress_bar: function(thermometer) {
        var progress_bar = thermometer.find('.progress_bar');
        var progress_bar_width = function() {
          var progress_bar_wrapper_width = $('.progress_bar_wrapper').width();
          var steps = thermometer.find('li');
          var active_step_number = steps.index(helpers.active_step(thermometer)) + 1;
          return (active_step_number / steps.size()) * progress_bar_wrapper_width;
        };

        if (config.animate) {
          progress_bar.animate({'width': progress_bar_width()}, 1000);
        } else {
          progress_bar.css('width', progress_bar_width());
        }
      }
    }


    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error( 'Method "' +  method + '" does not exist in thermometer plugin!');
    }
  }

})(jQuery);
