'use strict';

function _parseTime (duration) {
  if( typeof duration !== 'string' ) return null;

  // RegExp match: matched, t, decimals, ms
  var matched = duration.match(/([0-9](\.[0-9])?)(m)?s/);

  if( !matched ) return null;

  return matched[3] ? Number(matched[1]) : Number(matched[1])*1000;
}

function detectDuration (el, alt_value) {
  var animation_time = _parseTime( window.getComputedStyle(el).animationDuration ),
      transition_time = _parseTime( window.getComputedStyle(el).transitionDuration ),
      time = null;

  if( animation_time === null ) time = transition_time;
  else if( transition_time === null ) time = animation_time;
  else time = Math.max( animation_time, transition_time );

  return time === null ? (alt_value === undefined ? 0 : alt_value) : time;
}

module.exports = detectDuration;
