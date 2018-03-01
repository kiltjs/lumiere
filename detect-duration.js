(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.lumiere = factory());
}(this, (function () { 'use strict';

function detectDuration (el) {
  var time = 0;
  var duration = window.getComputedStyle(el).animationDuration;
  if( duration ) {
    duration.replace(/([0-9](\.[0-9])?)(m)?s/, function (matched, t, decimals, ms) {
      time += ms ? Number(t) : Number(t)*1000;
    });
  }
  if( window.getComputedStyle(el).animationDelay ) {
    window.getComputedStyle(el).animationDelay.replace(/([0-9](\.[0-9])?)(m)?s/, function (matched, t, decimals, ms) {
      time += ms ? Number(t) : Number(t)*1000;
    });
  }
  duration = window.getComputedStyle(el).transitionDuration;
  if( duration ) {
    duration.replace(/([0-9](\.[0-9])?)(m)?s/, function (matched, t, decimals, ms) {
      t = ms ? Number(t) : Number(t)*1000;
      if( t > time ) {
        time = t;
      }
    });
  }
  // console.log('animationTime', el, time);
  return time;
}

return detectDuration;

})));
