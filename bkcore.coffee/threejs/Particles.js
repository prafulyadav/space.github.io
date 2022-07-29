

(function() {
  var Particle, Particles, exports, _base;

  Particles = (function() {
    /*
        Creates a new particle system using given parameters
        
        @param {Object{max, spawnRate, spawn, velocity, randomness,
        force, spawnRadius, life, friction, color, color2, tint,
        texture, size, blending, depthTest, transparent, opacity}} opts
    */

    function Particles(opts) {
      var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      this.black = new THREE.Color(0x000000);
      this.white = new THREE.Color(0xffffff);
      this.material = new THREE.ParticleBasicMaterial({
        color: (_ref = opts.tint) != null ? _ref : 0xffffff,
        map: (_ref1 = opts.texture) != null ? _ref1 : null,
        size: (_ref2 = opts.size) != null ? _ref2 : 4,
        blending: (_ref3 = opts.blending) != null ? _ref3 : THREE.AdditiveBlending,
        depthTest: (_ref4 = opts.depthTest) != null ? _ref4 : false,
        transparent: (_ref5 = opts.transparent) != null ? _ref5 : true,
        vertexColors: true,
        opacity: (_ref6 = opts.opacity) != null ? _ref6 : 1.0,
        sizeAttenuation: true
      });
      this.max = (_ref7 = opts.max) != null ? _ref7 : 1000;
      this.spawnRate = (_ref8 = opts.spawnRate) != null ? _ref8 : 0;
      this.spawn = (_ref9 = opts.spawn) != null ? _ref9 : new THREE.Vector3();
      this.velocity = (_ref10 = opts.velocity) != null ? _ref10 : new THREE.Vector3();
      this.randomness = (_ref11 = opts.randomness) != null ? _ref11 : new THREE.Vector3();
      this.force = (_ref12 = opts.force) != null ? _ref12 : new THREE.Vector3();
      this.spawnRadius = (_ref13 = opts.spawnRadius) != null ? _ref13 : new THREE.Vector3();
      this.life = (_ref14 = opts.life) != null ? _ref14 : 60;
      this.ageing = 1 / this.life;
      this.friction = (_ref15 = opts.friction) != null ? _ref15 : 1.0;
      this.color = new THREE.Color((_ref16 = opts.color) != null ? _ref16 : 0xffffff);
      this.color2 = opts.color2 != null ? new THREE.Color(opts.color2) : null;
      this.position = (_ref17 = opts.position) != null ? _ref17 : new THREE.Vector3();
      this.rotation = (_ref18 = opts.rotation) != null ? _ref18 : new THREE.Vector3();
      this.sort = (_ref19 = opts.sort) != null ? _ref19 : false;
      this.pool = [];
      this.buffer = [];
      this.geometry = null;
      this.system = null;
      this.build();
    }

    /*
        Emits given number of particles
        @param  int count
    */


    Particles.prototype.emit = function(count) {
      var emitable, i, p, _i, _results;
      emitable = Math.min(count, this.pool.length);
      _results = [];
      for (i = _i = 0; 0 <= emitable ? _i <= emitable : _i >= emitable; i = 0 <= emitable ? ++_i : --_i) {
        p = this.pool.pop();
        p.available = false;
        p.position.copy(this.spawn).addSelf(this.randomVector().multiplySelf(this.spawnRadius));
        p.velocity.copy(this.velocity).addSelf(this.randomVector().multiplySelf(this.randomness));
        p.force.copy(this.force);
        p.basecolor.copy(this.color);
        if (this.color2 != null) {
          p.basecolor.lerpSelf(this.color2, Math.random());
        }
        _results.push(p.life = 1.0);
      }
      return _results;
    };

    /*
        @private
    */


    Particles.prototype.build = function() {
      var i, p, _i, _ref;
      this.geometry = new THREE.Geometry();
      this.geometry.dynamic = true;
      this.pool = [];
      this.buffer = [];
      for (i = _i = 0, _ref = this.max; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = new bkcore.threejs.Particle();
        this.pool.push(p);
        this.buffer.push(p);
        this.geometry.vertices.push(p.position);
        this.geometry.colors.push(p.color);
      }
      this.system = new THREE.ParticleSystem(this.geometry, this.material);
      this.system.position = this.position;
      this.system.rotation = this.rotation;
      return this.system.sort = this.sort;
    };

    /*
        @private
    */


    Particles.prototype.randomVector = function() {
      return new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    };

    /*
        Updates particles (should be call in a RAF loop)
        @param  float dt time delta ~1.0
    */


    Particles.prototype.update = function(dt) {
      var df, dv, i, l, p, _i, _ref;
      df = new THREE.Vector3();
      dv = new THREE.Vector3();
      for (i = _i = 0, _ref = this.buffer.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = this.buffer[i];
        if (p.available) {
          continue;
        }
        p.life -= this.ageing;
        if (p.life <= 0) {
          p.reset();
          this.pool.push(p);
          continue;
        }
        l = p.life > 0.5 ? 1.0 : p.life + 0.5;
        p.color.setRGB(l * p.basecolor.r, l * p.basecolor.g, l * p.basecolor.b);
        if (this.friction !== 1.0) {
          p.velocity.multiplyScalar(this.friction);
        }
        df.copy(p.force).multiplyScalar(dt);
        p.velocity.addSelf(df);
        dv.copy(p.velocity).multiplyScalar(dt);
        p.position.addSelf(dv);
      }
      if (this.spawnRate > 0) {
        this.emit(this.spawnRate);
      }
      this.geometry.verticesNeedUpdate = true;
      return this.geometry.colorsNeedUpdate = true;
    };

    return Particles;

  })();

  /*
    Particle sub class
    
    @class bkcore.threejs.Particle
    @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
  */


  Particle = (function() {

    function Particle() {
      this.position = new THREE.Vector3(-10000, -10000, -10000);
      this.velocity = new THREE.Vector3();
      this.force = new THREE.Vector3();
      this.color = new THREE.Color(0x000000);
      this.basecolor = new THREE.Color(0x000000);
      this.life = 0.0;
      this.available = true;
    }

    Particle.prototype.reset = function() {
      this.position.set(0, -100000, 0);
      this.velocity.set(0, 0, 0);
      this.force.set(0, 0, 0);
      this.color.setRGB(0, 0, 0);
      this.basecolor.setRGB(0, 0, 0);
      this.life = 0.0;
      return this.available = true;
    };

    return Particle;

  })();

  /*
    Exports
    @package bkcore.threejs
  */


  exports = exports != null ? exports : this;

  exports.bkcore || (exports.bkcore = {});

  (_base = exports.bkcore).threejs || (_base.threejs = {});

  exports.bkcore.threejs.Particle = Particle;

  exports.bkcore.threejs.Particles = Particles;

}).call(this);
