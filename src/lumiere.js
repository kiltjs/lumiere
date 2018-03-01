
export var animate = (function (rAF, performance, _now) {
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

  function _noop (value) { return value; }

  function _runListeners (listeners) {
    listeners.forEach(function (listener) { listener(); });
  }

  function animate ( duration, progressFn, atEnd, timingFunction ) {
    var start, frame_id, listeners = [],
        _atEnd = function () {
          if( atEnd ) atEnd();
          if( listeners.length ) _runListeners(listeners);
        };

    timingFunction = timingFunction || _noop;

    progressFn(duration === 0 ? 1 : 0);

    if( duration > 0 ) {
      start = performance.now();

      frame_id = _requestAnimationFrame(function step() {
        var elapsed = performance.now() - start;

        if( elapsed >= duration ) {
          progressFn(1);
          _atEnd();
        } else {
          progressFn( timingFunction(elapsed/duration) );
          frame_id = _requestAnimationFrame(step);
        }
      });
    } else _atEnd();

    return {
      then: function (listener) {
        listeners.push(listener);
      },
      cancel: function (reject) {
        _cancelAnimationFrame(frame_id);
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

export function detectDuration (el) {
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
