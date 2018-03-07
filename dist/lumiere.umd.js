(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.lumiere = factory());
}(this, (function () { 'use strict';

var animate = (function (rAF, performance, _now) {
  var _requestAnimationFrame = rAF.requestFrame,
      _cancelAnimationFrame = rAF.cancel;

  if( 'now' in performance == false ) {
    var now_offset = _now();

    if( performance.timing && performance.timing.navigationStart ){
      now_offset = performance.timing.navigationStart;
    }

    performance.now = function now(){
      return _now() - now_offset;
    };
  }

  function _runListeners (listeners, duration) {
    for( var i = 0, n = listeners.length; i < n ; i++ ) listeners[i](duration);
  }

  function animate ( duration, progressFn, timingFunction ) {
    var start, frame_id, listeners = [], cancel_listeners = [];

    timingFunction = timingFunction || function (value) { return value; };

    if( duration > 0 ) {
      progressFn(0);
      start = performance.now();

      frame_id = _requestAnimationFrame(function step() {
        var elapsed = performance.now() - start;

        if( elapsed >= duration ) {
          progressFn(1);
          _runListeners(listeners, duration);
        } else {
          progressFn( timingFunction(elapsed/duration) );
          frame_id = _requestAnimationFrame(step);
        }
      });
    } else _runListeners(listeners, 1);

    return {
      then: function (onFulfill, onCancel) {
        if( typeof onFulfill === 'function' ) listeners.push( onFulfill );
        if( typeof onCancel === 'function' ) cancel_listeners.push( onCancel );
        return this;
      },
      cancel: function () {
        if( frame_id ) _cancelAnimationFrame(frame_id);
        frame_id = null;
        _runListeners(cancel_listeners, duration);
      },
    };
  }

  return animate;
})(
  (function (rAF) {
    if( rAF ) return rAF;
    rAF = {};

    var last_time = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
      rAF.requestFrame = window[vendors[x]+'RequestAnimationFrame'];
      rAF.cancel = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if( !rAF.requestFrame ) {
      rAF.requestFrame = function(callback, _element) {
        var curr_time = new Date().getTime();
        var time_to_call = Math.max(0, 16 - (curr_time - last_time));
        var id = window.setTimeout(function() {
          callback(curr_time + time_to_call);
        }, time_to_call );
        last_time = curr_time + time_to_call;
        return id;
      };

      rAF.cancel = function(id) {
        clearTimeout(id);
      };
    }

    return rAF;
  })( window.requestAnimationFrame ? { requestFrame: window.requestAnimationFrame, cancel: window.cancelAnimationFrame } : null ),
  'performance' in window ? window.performance : {},
  Date.now || function () {  // thanks IE8
    return new Date().getTime();
  }
);

return animate;

})));
