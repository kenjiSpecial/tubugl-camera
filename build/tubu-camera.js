(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('wolfy87-eventemitter'), require('gl-matrix/src/gl-matrix'), require('tubugl-math'), require('gsap/TweenLite'), require('tubugl-math/src/vector3'), require('tubugl-utils'), require('gl-matrix'), require('tubugl-math/src/euler')) :
  typeof define === 'function' && define.amd ? define(['exports', 'wolfy87-eventemitter', 'gl-matrix/src/gl-matrix', 'tubugl-math', 'gsap/TweenLite', 'tubugl-math/src/vector3', 'tubugl-utils', 'gl-matrix', 'tubugl-math/src/euler'], factory) :
  (factory((global.Tubu = {}),global.EventEmitter,global.glMatrix,global.tubuglMath,global.TweenLite,global.vector3,global.tubuglUtils,global.glMatrix$1,global.euler));
}(this, (function (exports,EventEmitter,glMatrix,tubuglMath,TweenLite,vector3,tubuglUtils,glMatrix$1,euler) { 'use strict';

  EventEmitter = EventEmitter && EventEmitter.hasOwnProperty('default') ? EventEmitter['default'] : EventEmitter;
  TweenLite = TweenLite && TweenLite.hasOwnProperty('default') ? TweenLite['default'] : TweenLite;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var PerspectiveCamera = function (_EventEmitter) {
  	inherits(PerspectiveCamera, _EventEmitter);

  	function PerspectiveCamera() {
  		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.innerWidth;
  		var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.innerHeight;
  		var fov = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  		var near = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  		var far = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1000;
  		classCallCheck(this, PerspectiveCamera);

  		var _this = possibleConstructorReturn(this, (PerspectiveCamera.__proto__ || Object.getPrototypeOf(PerspectiveCamera)).call(this));

  		_this.type = 'perspectiveCamera';
  		_this.position = new tubuglMath.Vector3();
  		_this.rotation = new tubuglMath.Euler();

  		_this._fov = fov;
  		_this._width = width;
  		_this._height = height;
  		_this._near = near;
  		_this._far = far;

  		_this.needsUpdate = true;

  		_this.viewMatrix = glMatrix.mat4.create();
  		_this.projectionMatrix = glMatrix.mat4.create();

  		setTimeout(function () {
  			_this._updateViewMatrix();
  			_this._updateProjectionMatrix();
  		}, 0);
  		return _this;
  	}

  	createClass(PerspectiveCamera, [{
  		key: 'update',
  		value: function update() {
  			var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  			this._updateViewMatrix(forceUpdate);

  			return this;
  		}
  	}, {
  		key: 'setPosition',
  		value: function setPosition(x, y, z) {
  			this.updatePosition(x, y, z);
  		}
  	}, {
  		key: 'updatePosition',
  		value: function updatePosition(x, y, z) {
  			if (x !== undefined) this.position.x = x;
  			if (y !== undefined) this.position.y = y;
  			if (z !== undefined) this.position.z = z;

  			return this;
  		}
  	}, {
  		key: 'setRotation',
  		value: function setRotation(x, y, z) {
  			this.updateRotation(x, y, z);
  		}
  	}, {
  		key: 'updateRotation',
  		value: function updateRotation(x, y, z) {
  			if (x !== undefined) this.rotation.x = x;
  			if (y !== undefined) this.rotation.y = y;
  			if (z !== undefined) this.rotation.z = z;

  			return this;
  		}

  		/**
     *
     * @param {Array}targetPosition
     */

  	}, {
  		key: 'lookAt',
  		value: function lookAt(targetPosition) {
  			if (Array.isArray(targetPosition)) glMatrix.mat4.lookAt(this.viewMatrix, this.position.array, targetPosition, [0, 1, 0]);else glMatrix.mat4.lookAt(this.viewMatrix, this.position.array, targetPosition.array, [0, 1, 0]);

  			glMatrix.mat4.invert(this.rotation.matrix, this.viewMatrix);
  			this.rotation.setFromRotationMatrix(this.rotation.matrix);
  			this.needsUpdate = false;

  			return this;
  		}
  	}, {
  		key: 'log',
  		value: function log() {
  			console.log('[PerspectiveCamera] position: {x: ' + this.position.x + ', y: ' + this.position.y + ', z: ' + this.position.z + ' }');
  			console.log('[PerspectiveCamera] rotation: {x: ' + this.rotation.x + ', y: ' + this.rotation.y + ', z: ' + this.rotation.z + ' }');
  		}
  	}, {
  		key: 'updateSize',
  		value: function updateSize(width, height) {
  			this._width = width;
  			this._height = height;

  			this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateFov',
  		value: function updateFov(fov) {
  			var updateProjectionMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  			this._fov = fov;

  			if (updateProjectionMatrix) this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateDistance',
  		value: function updateDistance(near, far) {
  			if (near) this._near = near;
  			if (far) this._far = far;

  			this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateMatrix',
  		value: function updateMatrix() {
  			this.updateProjectionMatrix();
  			this.updateViewMatrix();
  		}
  	}, {
  		key: 'updateProjectionMatrix',
  		value: function updateProjectionMatrix() {
  			this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateViewMatrix',
  		value: function updateViewMatrix() {
  			this._updateViewMatrix();
  		}
  	}, {
  		key: '_updateProjectionMatrix',
  		value: function _updateProjectionMatrix() {
  			glMatrix.mat4.perspective(this.projectionMatrix, this._fov / 180 * Math.PI, this._width / this._height, this._near, this._far);
  		}
  	}, {
  		key: '_updateViewMatrix',
  		value: function _updateViewMatrix() {
  			var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  			if (!this.rotation.needsMatrixUpdate && !this.needsUpdate && !forceUpdate) return;

  			this.rotation.updateMatrix();
  			glMatrix.mat4.copy(this.viewMatrix, this.rotation.matrix);
  			this.viewMatrix[12] = this.position.array[0];
  			this.viewMatrix[13] = this.position.array[1];
  			this.viewMatrix[14] = this.position.array[2];
  			glMatrix.mat4.invert(this.viewMatrix, this.viewMatrix);

  			this.needsUpdate = false;

  			return this;
  		}
  	}, {
  		key: 'fov',
  		get: function get$$1() {
  			return this._fov;
  		}
  	}, {
  		key: 'width',
  		get: function get$$1() {
  			return this._width;
  		}
  	}, {
  		key: 'height',
  		get: function get$$1() {
  			return this._height;
  		}
  	}, {
  		key: 'near',
  		get: function get$$1() {
  			return this._near;
  		}
  	}, {
  		key: 'far',
  		get: function get$$1() {
  			return this._far;
  		}
  	}]);
  	return PerspectiveCamera;
  }(EventEmitter);

  var DampedAction = function () {
  	function DampedAction() {
  		classCallCheck(this, DampedAction);

  		this.value = 0.0;
  		this.damping = 0.85;
  	}

  	createClass(DampedAction, [{
  		key: "addForce",
  		value: function addForce(force) {
  			this.value += force;
  		}

  		/** updates the damping and calls {@link damped-callback}. */

  	}, {
  		key: "update",
  		value: function update() {
  			var isActive = this.value * this.value > 0.000001;
  			if (isActive) {
  				this.value *= this.damping;
  			} else {
  				this.stop();
  			}
  			return this.value;
  		}

  		/** stops the damping. */

  	}, {
  		key: "stop",
  		value: function stop() {
  			this.value = 0.0;
  		}
  	}]);
  	return DampedAction;
  }();

  var CameraController = function (_EventEmitter) {
  	inherits(CameraController, _EventEmitter);

  	function CameraController(camera) {
  		var domElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
  		classCallCheck(this, CameraController);

  		var _this = possibleConstructorReturn(this, (CameraController.__proto__ || Object.getPrototypeOf(CameraController)).call(this));

  		if (!camera) {
  			console.error('camera is undefined');
  		}
  		_this._camera = camera;
  		_this.domElement = domElement;

  		_this.target = new vector3.Vector3();

  		_this.minDistance = 0;
  		_this.maxDistance = Infinity;

  		_this.isEnabled = true;

  		// Set to true to enable damping (inertia)
  		// If damping is enabled, you must call controls.update() in your animation loop
  		_this.isDamping = false;
  		_this.dampingFactor = 0.25;

  		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
  		// Set to false to disable zooming
  		_this.isZoom = true;
  		_this.zoomSpeed = 1.0;

  		// Set to false to disable rotating
  		_this.isRotate = true;
  		_this.rotateSpeed = 1.0;

  		// Set to false to disable panning
  		_this.isPan = true;
  		_this.keyPanSpeed = 7.0; // pixels moved per arrow key push

  		// Set to false to disable use of the keys
  		_this.enableKeys = true;

  		// The four arrow keys
  		_this.keys = {
  			LEFT: 37,
  			UP: 38,
  			RIGHT: 39,
  			BOTTOM: 40,
  			SHIFT: 16
  		};

  		// for reset
  		_this.originTarget = new vector3.Vector3();
  		_this.originPosition = new vector3.Vector3(_this._camera.position.x, _this._camera.position.y, _this._camera.position.z);

  		_this.targetXDampedAction = new DampedAction();
  		_this.targetYDampedAction = new DampedAction();
  		_this.targetZDampedAction = new DampedAction();
  		_this.targetThetaDampedAction = new DampedAction();
  		_this.targetPhiDampedAction = new DampedAction();
  		_this.targetRadiusDampedAction = new DampedAction();

  		_this._isShiftDown = false;

  		_this._rotateStart = {
  			x: null,
  			y: null
  		};
  		_this._rotateEnd = {
  			x: null,
  			y: null
  		};
  		_this._roatteDelta = {
  			x: null,
  			y: null
  		};

  		var dX = _this._camera.position.x;
  		var dY = _this._camera.position.y;
  		var dZ = _this._camera.position.z;
  		var radius = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
  		var theta = Math.atan2(_this._camera.position.x, _this._camera.position.z); // equator angle around y-up axis
  		var phi = Math.acos(tubuglUtils.mathUtils.clamp(_this._camera.position.y / radius, -1, 1)); // polar angle
  		_this._spherical = {
  			radius: radius,
  			theta: theta,
  			phi: phi
  		};

  		_this._pan = {
  			axis: {}
  		};

  		_this._bindEvens();
  		_this.setEventHandler();
  		_this.startTick();
  		return _this;
  	}

  	createClass(CameraController, [{
  		key: 'setEventHandler',
  		value: function setEventHandler() {
  			this.domElement.addEventListener('contextmenu', this._contextMenuHandler, false);
  			this.domElement.addEventListener('mousedown', this._mouseDownHandler, false);
  			this.domElement.addEventListener('wheel', this._mouseWheelHandler, false);

  			this.domElement.addEventListener('touchstart', this._touchStartHandler, false);
  			this.domElement.addEventListener('touchend', this._touchEndHandler, false);
  			this.domElement.addEventListener('touchmove', this._touchMoveHandler, false);

  			window.addEventListener('keydown', this._onKeyDownHandler, false);
  			window.addEventListener('keyup', this._onKeyUpHandler, false);
  		}
  	}, {
  		key: 'removeEventHandler',
  		value: function removeEventHandler() {
  			this.domElement.removeEventListener('contextmenu', this._contextMenuHandler, false);
  			this.domElement.removeEventListener('mousedown', this._mouseDownHandler, false);
  			this.domElement.removeEventListener('wheel', this._mouseWheelHandler, false);
  			this.domElement.removedEventListener('mousemove', this._mouseMoveHandler, false);
  			window.removeEventListener('mouseup', this._mouseUpHandler, false);

  			this.domElement.removeEventListener('touchstart', this._touchStartHandler, false);
  			this.domElement.removeEventListener('touchend', this._touchEndHandler, false);
  			this.domElement.removeEventListener('touchmove', this._touchMoveHandler, false);

  			window.removeEventListener('keydown', this._onKeyDownHandler, false);
  			window.removeEventListener('keydown', this._onKeyUpHandler, false);
  		}
  	}, {
  		key: 'startTick',
  		value: function startTick() {
  			TweenLite.ticker.addEventListener('tick', this.tick, this);
  		}
  	}, {
  		key: 'tick',
  		value: function tick() {
  			this.updateDampedAction();
  			this.updateCamera();
  		}
  	}, {
  		key: 'updateDampedAction',
  		value: function updateDampedAction() {
  			this.target.x += this.targetXDampedAction.update();
  			this.target.y += this.targetYDampedAction.update();
  			this.target.z += this.targetZDampedAction.update();

  			this._spherical.theta += this.targetThetaDampedAction.update();
  			this._spherical.phi += this.targetPhiDampedAction.update();
  			this._spherical.radius += this.targetRadiusDampedAction.update();
  		}
  	}, {
  		key: 'updateCamera',
  		value: function updateCamera() {
  			var s = this._spherical;
  			var sinPhiRadius = Math.sin(s.phi) * s.radius;

  			this._camera.position.x = sinPhiRadius * Math.sin(s.theta) + this.target.x;
  			this._camera.position.y = Math.cos(s.phi) * s.radius + this.target.y;
  			this._camera.position.z = sinPhiRadius * Math.cos(s.theta) + this.target.z;

  			this._camera.lookAt(this.target);
  		}
  	}, {
  		key: '_bindEvens',
  		value: function _bindEvens() {
  			this._contextMenuHandler = this._contextMenuHandler.bind(this);
  			this._mouseDownHandler = this._mouseDownHandler.bind(this);
  			this._mouseWheelHandler = this._mouseWheelHandler.bind(this);
  			this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
  			this._mouseUpHandler = this._mouseUpHandler.bind(this);

  			this._touchStartHandler = this._touchStartHandler.bind(this);
  			this._touchEndHandler = this._touchEndHandler.bind(this);
  			this._touchMoveHandler = this._touchMoveHandler.bind(this);

  			this._onKeyDownHandler = this._onKeyDownHandler.bind(this);
  			this._onKeyUpHandler = this._onKeyUpHandler.bind(this);
  		}
  	}, {
  		key: '_contextMenuHandler',
  		value: function _contextMenuHandler(event) {
  			if (!this.isEnabled) return;

  			event.preventDefault();
  		}
  	}, {
  		key: '_mouseDownHandler',
  		value: function _mouseDownHandler(event) {
  			if (!this.isEnabled) return;

  			if (event.button == 0) {
  				this.state = 'rotate';
  				this._rotateStart = {
  					x: event.clientX,
  					y: event.clientY
  				};
  			} else {
  				this.state = 'pan';
  				this._panStart = {
  					x: event.clientX,
  					y: event.clientY
  				};
  			}

  			this.domElement.addEventListener('mousemove', this._mouseMoveHandler, false);
  			window.addEventListener('mouseup', this._mouseUpHandler, false);
  		}
  	}, {
  		key: '_mouseUpHandler',
  		value: function _mouseUpHandler() {
  			this.domElement.removeEventListener('mousemove', this._mouseMoveHandler, false);
  			window.removeEventListener('mouseup', this._mouseUpHandler, false);
  		}
  	}, {
  		key: '_mouseMoveHandler',
  		value: function _mouseMoveHandler(event) {
  			if (!this.isEnabled) return;

  			if (this.state === 'rotate') {
  				this._rotateEnd = {
  					x: event.clientX,
  					y: event.clientY
  				};
  				this._roatteDelta = {
  					x: this._rotateEnd.x - this._rotateStart.x,
  					y: this._rotateEnd.y - this._rotateStart.y
  				};

  				this._updateRotateHandler();

  				this._rotateStart = {
  					x: this._rotateEnd.x,
  					y: this._rotateEnd.y
  				};
  			} else if (this.state === 'pan') {
  				this._panEnd = {
  					x: event.clientX,
  					y: event.clientY
  				};
  				this._panDelta = {
  					x: -0.5 * (this._panEnd.x - this._panStart.x),
  					y: 0.5 * (this._panEnd.y - this._panStart.y)
  				};

  				this._updatePanHandler();
  				this._panStart = {
  					x: this._panEnd.x,
  					y: this._panEnd.y
  				};
  			}
  			// this.update();
  		}
  	}, {
  		key: '_mouseWheelHandler',
  		value: function _mouseWheelHandler(event) {
  			if (event.deltaY > 0) {
  				// this._spherical.radius *= 1.05;
  				this.targetRadiusDampedAction.addForce(1);
  			} else {
  				this.targetRadiusDampedAction.addForce(-1);
  			}
  		}
  	}, {
  		key: '_touchStartHandler',
  		value: function _touchStartHandler(event) {
  			var dX = void 0,
  			    dY = void 0;
  			switch (event.touches.length) {
  				case 1:
  					this.state = 'rotate';
  					this._rotateStart = {
  						x: event.touches[0].clientX,
  						y: event.touches[0].clientY
  					};
  					break;
  				case 2:
  					this.state = 'zoom';
  					dX = event.touches[1].clientX - event.touches[0].clientX;
  					dY = event.touches[1].clientY - event.touches[0].clientY;
  					this._zoomDistance = Math.sqrt(dX * dX + dY * dY);
  					break;
  				case 3:
  					this.state = 'pan';
  					this._panStart = {
  						x: (event.touches[0].clientX + event.touches[1].clientX + event.touches[2].clientX) / 3,
  						y: (event.touches[0].clientY + event.touches[1].clientY + event.touches[2].clientY) / 3
  					};

  					break;
  			}
  		}
  	}, {
  		key: '_touchMoveHandler',
  		value: function _touchMoveHandler(event) {
  			var dX = void 0,
  			    dY = void 0,
  			    dDis = void 0;
  			switch (event.touches.length) {
  				case 1:
  					if (this.state !== 'rotate') return;
  					this._rotateEnd = {
  						x: event.touches[0].clientX,
  						y: event.touches[0].clientY
  					};
  					this._roatteDelta = {
  						x: (this._rotateEnd.x - this._rotateStart.x) * 0.5,
  						y: (this._rotateEnd.y - this._rotateStart.y) * 0.5
  					};

  					this._updateRotateHandler();

  					this._rotateStart = {
  						x: this._rotateEnd.x,
  						y: this._rotateEnd.y
  					};
  					break;
  				case 2:
  					if (this.state !== 'zoom') return;
  					dX = event.touches[1].clientX - event.touches[0].clientX;
  					dY = event.touches[1].clientY - event.touches[0].clientY;
  					this._zoomDistanceEnd = Math.sqrt(dX * dX + dY * dY);

  					dDis = this._zoomDistanceEnd - this._zoomDistance;
  					dDis *= 1.5;

  					var targetRadius = this._spherical.radius - dDis;
  					targetRadius = tubuglUtils.mathUtils.clamp(targetRadius, this.minDistance, this.maxDistance);
  					this._zoomDistance = this._zoomDistanceEnd;

  					TweenLite.killTweensOf(this._spherical);
  					TweenLite.to(this._spherical, 0.3, {
  						radius: targetRadius
  					});
  					break;
  				case 3:
  					this._panEnd = {
  						x: (event.touches[0].clientX + event.touches[1].clientX + event.touches[2].clientX) / 3,
  						y: (event.touches[0].clientY + event.touches[1].clientY + event.touches[2].clientY) / 3
  					};
  					this._panDelta = {
  						x: this._panEnd.x - this._panStart.x,
  						y: this._panEnd.y - this._panStart.y
  					};

  					this._panDelta.x *= -1;

  					this._updatePanHandler();
  					this._panStart = {
  						x: this._panEnd.x,
  						y: this._panEnd.y
  					};
  					break;
  			}

  			// this.update();
  		}
  	}, {
  		key: '_touchEndHandler',
  		value: function _touchEndHandler(event) {}
  	}, {
  		key: '_onKeyDownHandler',
  		value: function _onKeyDownHandler(event) {
  			var dX = 0,
  			    dY = 0;

  			switch (event.keyCode) {
  				case this.keys.SHIFT:
  					this._isShiftDown = true;
  					break;
  				case this.keys.LEFT:
  					dX = -10;
  					break;
  				case this.keys.RIGHT:
  					dX = 10;
  					break;
  				case this.keys.UP:
  					dY = 10;
  					break;
  				case this.keys.BOTTOM:
  					dY = -10;
  					break;
  			}

  			if (!this._isShiftDown) {
  				this._panDelta = {
  					x: dX,
  					y: dY
  				};
  				this._updatePanHandler();
  			} else {
  				this._roatteDelta = {
  					x: -dX,
  					y: dY
  				};
  				this._updateRotateHandler();
  			}

  			// this.update();
  		}
  	}, {
  		key: '_onKeyUpHandler',
  		value: function _onKeyUpHandler(event) {
  			switch (event.keyCode) {
  				case this.keys.SHIFT:
  					this._isShiftDown = false;
  					break;
  			}
  		}
  	}, {
  		key: '_updatePanHandler',
  		value: function _updatePanHandler() {
  			var xDir = glMatrix$1.vec3.create();
  			var yDir = glMatrix$1.vec3.create();
  			var zDir = glMatrix$1.vec3.create();
  			zDir[0] = this.target.x - this._camera.position.x;
  			zDir[1] = this.target.y - this._camera.position.y;
  			zDir[2] = this.target.z - this._camera.position.z;
  			glMatrix$1.vec3.normalize(zDir, zDir);

  			glMatrix$1.vec3.cross(xDir, zDir, [0, 1, 0]);
  			glMatrix$1.vec3.cross(yDir, xDir, zDir);

  			var scale = Math.max(this._spherical.radius / 2000, 0.001);

  			this.targetXDampedAction.addForce((xDir[0] * this._panDelta.x + yDir[0] * this._panDelta.y) * scale);
  			this.targetYDampedAction.addForce((xDir[1] * this._panDelta.x + yDir[1] * this._panDelta.y) * scale);
  			this.targetZDampedAction.addForce((xDir[2] * this._panDelta.x + yDir[2] * this._panDelta.y) * scale);
  		}
  	}, {
  		key: '_updateRotateHandler',
  		value: function _updateRotateHandler() {
  			this.targetThetaDampedAction.addForce(-this._roatteDelta.x / this.domElement.clientWidth);
  			this.targetPhiDampedAction.addForce(-this._roatteDelta.y / this.domElement.clientHeight);
  		}
  	}]);
  	return CameraController;
  }(EventEmitter);

  var OrthographicCamera = function (_EventEmitter) {
  	inherits(OrthographicCamera, _EventEmitter);

  	function OrthographicCamera() {
  		var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -window.innerWidth / 2;
  		var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.innerWidth / 2;
  		var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.innerHeight / 2;
  		var bottom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -window.innerHeight / 2;
  		var near = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  		var far = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1000;
  		classCallCheck(this, OrthographicCamera);

  		var _this = possibleConstructorReturn(this, (OrthographicCamera.__proto__ || Object.getPrototypeOf(OrthographicCamera)).call(this));

  		_this.type = 'orthographicCamera';
  		_this.position = new vector3.Vector3();
  		_this.rotation = new euler.Euler();

  		_this._left = left;
  		_this._right = right;
  		_this._top = top;
  		_this._bottom = bottom;
  		_this._near = near;
  		_this._far = far;

  		_this.needsUpdate = true;

  		_this.viewMatrix = glMatrix.mat4.create();
  		_this.projectionMatrix = glMatrix.mat4.create();

  		setTimeout(function () {
  			_this._updateViewMatrix();
  			_this._updateProjectionMatrix();
  		}, 0);
  		return _this;
  	}

  	createClass(OrthographicCamera, [{
  		key: 'update',
  		value: function update() {
  			var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  			this._updateViewMatrix(forceUpdate);

  			return this;
  		}
  	}, {
  		key: 'setPosition',
  		value: function setPosition(x, y, z) {
  			this.updatePosition(x, y, z);
  		}
  	}, {
  		key: 'updatePosition',
  		value: function updatePosition(x, y, z) {
  			if (x !== undefined) this.position.x = x;
  			if (y !== undefined) this.position.y = y;
  			if (z !== undefined) this.position.z = z;

  			return this;
  		}
  	}, {
  		key: 'setRotation',
  		value: function setRotation(x, y, z) {
  			this.updateRotation(x, y, z);
  		}
  	}, {
  		key: 'updateRotation',
  		value: function updateRotation(x, y, z) {
  			if (x !== undefined) this.rotation.x = x;
  			if (y !== undefined) this.rotation.y = y;
  			if (z !== undefined) this.rotation.z = z;

  			return this;
  		}

  		/**
     *
     * @param {Array}targetPosition
     */

  	}, {
  		key: 'lookAt',
  		value: function lookAt(targetPosition) {
  			if (Array.isArray(targetPosition)) glMatrix.mat4.lookAt(this.viewMatrix, this.position.array, targetPosition, [0, 1, 0]);else glMatrix.mat4.lookAt(this.viewMatrix, this.position.array, targetPosition.array, [0, 1, 0]);

  			glMatrix.mat4.invert(this.rotation.matrix, this.viewMatrix);
  			this.rotation.setFromRotationMatrix(this.rotation.matrix);
  			this.needsUpdate = false;

  			return this;
  		}
  	}, {
  		key: 'log',
  		value: function log() {
  			console.log('[orthographicCamera] position: {x: ' + this.position.x + ', y: ' + this.position.y + ', z: ' + this.position.z + ' }');
  			console.log('[orthographicCamera] rotation: {x: ' + this.rotation.x + ', y: ' + this.rotation.y + ', z: ' + this.rotation.z + ' }');
  		}
  	}, {
  		key: 'updateSize',
  		value: function updateSize(left, right, top, bottom) {
  			this._left = left;
  			this._right = right;
  			this._top = top;
  			this._bottom = bottom;

  			this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateDistance',
  		value: function updateDistance(near, far) {
  			if (near) this._near = near;
  			if (far) this._far = far;

  			this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateMatrix',
  		value: function updateMatrix() {
  			this.updateProjectionMatrix();
  			this.updateViewMatrix();
  		}
  	}, {
  		key: 'updateProjectionMatrix',
  		value: function updateProjectionMatrix() {
  			this._updateProjectionMatrix();
  		}
  	}, {
  		key: 'updateViewMatrix',
  		value: function updateViewMatrix() {
  			this._updateViewMatrix();
  		}
  	}, {
  		key: '_updateProjectionMatrix',
  		value: function _updateProjectionMatrix() {
  			glMatrix.mat4.ortho(this.projectionMatrix, this._left, this._right, this._bottom, this._top, this._near, this._far);
  		}
  	}, {
  		key: '_updateViewMatrix',
  		value: function _updateViewMatrix() {
  			var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  			if (!this.rotation.needsMatrixUpdate && !this.needsUpdate && !forceUpdate) return;

  			this.rotation.updateMatrix();
  			glMatrix.mat4.copy(this.viewMatrix, this.rotation.matrix);
  			this.viewMatrix[12] = this.position.array[0];
  			this.viewMatrix[13] = this.position.array[1];
  			this.viewMatrix[14] = this.position.array[2];
  			glMatrix.mat4.invert(this.viewMatrix, this.viewMatrix);

  			this.needsUpdate = false;

  			return this;
  		}
  	}]);
  	return OrthographicCamera;
  }(EventEmitter);

  exports.PerspectiveCamera = PerspectiveCamera;
  exports.CameraController = CameraController;
  exports.OrthographicCamera = OrthographicCamera;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
