/**
 * Hot Stepper - jQuery plugin to easily create multistep forms
 * and a thermometer with stages for each step.
 * 
 * Source Code: https://github.com/coryschires/hot_stepper
 * 
 * Copyright (c) 2011 Cory Schires (coryschires.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1.0
 */


(function($) {

  $.hot_stepper = {
    defaults: {
      fields_valid: function() { return true; },
      after_transition: function() {},
      next_button_text: 'Next',
      prev_button_text: 'Prev'
    }
  }

  $.fn.hot_stepper = function(config) {

    var config = $.extend({}, $.hot_stepper.defaults, config);

    return this.each(function() {
      
      var form = $(this);
      var steps = form.find("fieldset");
      var number_of_steps = steps.size();
      var submit_button = form.find('input[type="submit"]');
      var prev_button = form.append("<button class='hs_button prev'>"+ config.prev_button_text +"</button>").find('button.prev');
      var next_button = form.append("<button class='hs_button next'>"+ config.next_button_text +"</button>").find('button.next');
      var buttons = form.find('.hs_button');
      var thermometer = form.before('<ul class="hs_thermometer"></ul>').prev();

      var current_step = function() {
        return steps.filter(':visible');
      }

      var transition_step = function(direction) {
        var curr_step = current_step();
        curr_step.hide();
        direction === 'next' ? curr_step.next().show() : curr_step.prev().show();
      };

      var update_button_visibility = function() {
        var curr_step = current_step()[0],
            first_step = steps.first()[0],
            last_step = steps.last()[0];

        if (curr_step === first_step) {
          prev_button.hide();
        } else if (curr_step === last_step) {
          next_button.hide();
          submit_button.show();
        } else {
          buttons.show();
          submit_button.hide();
        }
      };

      var build_thermometer_steps = function() {
        steps.each(function() {
          var step_name = $(this).find('legend').html();
          thermometer.append('<li>'+ step_name +'</li>');
        });
      };
      
      var update_active_class_for_thermometer = function() {
        var thermometer_steps = thermometer.find('li');
        var current_step_index = steps.index(current_step());
        thermometer_steps.removeClass('active');
        $(thermometer_steps.get(current_step_index)).addClass('active');
      };

      // setup DOM
      form.find('legend').hide();
      submit_button.hide();
      steps.hide().first().show();
      prev_button.hide();
      build_thermometer_steps();
      update_active_class_for_thermometer();

      buttons.click(function() {
        var direction = $(this).hasClass('prev') ? 'prev' : 'next';
        
        if ( direction === 'prev' || config.fields_valid() ) {
          transition_step(direction);
          update_button_visibility();
          update_active_class_for_thermometer();
          config.after_transition();
        }
        return false;
      });
    });
  }
})(jQuery);