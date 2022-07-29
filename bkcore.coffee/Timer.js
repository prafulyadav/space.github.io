
(function() {
  var Timer, exports;

  Timer = (function() {
    /*
        Creates a new timer, inactive by default.
        Call Timer.start() to activate.
    */

    function Timer() {
      this.time = {
        start: 0,
        current: 0,
        previous: 0,
        elapsed: 0,
        delta: 0
      };
      this.active = false;
    }

    /*
        Starts/restarts the timer.
    */


    Timer.prototype.start = function() {
      var now;
      now = (new Date).getTime();
      this.time.start = now;
      this.time.current = now;
      this.time.previous = now;
      this.time.elapsed = 0;
      this.time.delta = 0;
      return this.active = true;
    };

    /*
        Pauses(true)/Unpauses(false) the timer.
    
        @param bool Do pause
    */


    Timer.prototype.pause = function(doPause) {
      return this.active = !doPause;
    };

    /*
        Update method to be called inside a RAF loop
    */


    Timer.prototype.update = function() {
      var now;
      if (!this.active) {
        return;
      }
      now = (new Date).getTime();
      this.time.current = now;
      this.time.elapsed = this.time.current - this.time.start;
      this.time.delta = now - this.time.previous;
      return this.time.previous = now;
    };

    /*
        Returns a formatted version of the current elapsed time using msToTime().
    */


    Timer.prototype.getElapsedTime = function() {
      return this.constructor.msToTime(this.time.elapsed);
    };

    /*
        Formats a millisecond integer into a h/m/s/ms object
        
        @param x int In milliseconds
        @return Object{h,m,s,ms}
    */


    Timer.msToTime = function(t) {
      var h, m, ms, s;
      ms = t % 1000;
      s = Math.floor((t / 1000) % 60);
      m = Math.floor((t / 60000) % 60);
      h = Math.floor(t / 3600000);
      return {
        h: h,
        m: m,
        s: s,
        ms: ms,
        ms: ms
      };
    };

    /*
        Formats a millisecond integer into a h/m/s/ms object with prefix zeros
        
        @param x int In milliseconds
        @return Object<string>{h,m,s,ms}
    */


    Timer.msToTimeString = function(t) {
      var time;
      time = this.msToTime(t);
      time.h = this.zfill(time.h, 2);
      time.m = this.zfill(time.m, 2);
      time.s = this.zfill(time.s, 2);
      time.ms = this.zfill(time.ms, 4);
      return time;
    };

    /*
        Convert given integer to string and fill with heading zeros
    
        @param num int Number to convert/fill
        @param size int Desired string size
    */


    Timer.zfill = function(num, size) {
      var len;
      len = size - num.toString().length;
      if (len > 0) {
        return new Array(len + 1).join('0') + num;
      } else {
        return num.toString();
      }
    };

    return Timer;

  })();

  /*
    Exports
    @package bkcore
  */


  exports = exports != null ? exports : this;

  exports.bkcore || (exports.bkcore = {});

  exports.bkcore.Timer = Timer;

}).call(this);
