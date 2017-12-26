const EventEmitter = require('wolfy87-eventemitter');
import { Vector3 } from 'tubugl-math/src/vector3';

export class CameraController extends EventEmitter {
	constructor(camera, domElement = document.body) {
		super();

		if (!camera) {
			console.error('camera is undefined');
		}
		this._camera = camera;
		this.domElement = domElement;

		this.target = new Vector3();

		this.minDistance = 0;
		this.maxDistance = Infinity;

		this.isEnabled = true;

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.isDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.isZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.isRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.isPan = true;
		this.keyPanSpeed = 7.0; // pixels moved per arrow key push

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// for reset
		this.originTarget = new Vector3();
		this.originPosition = new Vector3(this._camera.position.x, this._camera.position.y, this._camera.position.z);

		this._bindEvens();
		this.setEventHandler();
	}
	setEventHandler() {
		this.domElement.addEventListener('mousedown', this._mouseDownHandler, false);
		this.domElement.addEventListener('wheel', this._mouseWheelHandler, false);

		this.domElement.addEventListener('touchstart', this._touchStartHandler, false);
		this.domElement.addEventListener('touchend', this._touchEndHandler, false);
		this.domElement.addEventListener('touchmove', this._touchMoveHandler, false);

		window.addEventListener('keydown', this._onKeyDownHandler, false);
	}
	removeEventHandler() {
		this.domElement.removeEventListener('mousedown', this._mouseDownHandler, false);
		this.domElement.removeEventListener('wheel', this._mouseWheelHandler, false);

		this.domElement.removeEventListener('touchstart', this._touchStartHandler, false);
		this.domElement.removeEventListener('touchend', this._touchEndHandler, false);
		this.domElement.removeEventListener('touchmove', this._touchMoveHandler, false);

		window.removeEventListener('keydown', this._onKeyDownHandler, false);
	}
	_bindEvens() {
		this._mouseDownHandler = this._mouseDownHandler.bind(this);
		this._mouseWheelHandler = this._mouseDownHandler.bind(this);

		this._touchStartHandler = this._touchStartHandler.bind(this);
		this._touchEndHandler = this._touchEndHandler.bind(this);
		this._touchMoveHandler = this._touchMoveHandler.bind(this);

		this._onKeyDownHandler = this._onKeyDownHandler.bind(this);
	}
	_mouseDownHandler(event) {
		if (!this.isEnabled) return;

		console.log(event.button);
	}
	_mouseUpHandler(event) {
		if (!this.isEnabled) return;
	}
	_mouseMoveHandler(event) {}
	_mouseWheelHandler(event) {}

	_touchStartHandler(event) {}

	_touchMoveHandler(event) {}

	_touchEndHandler(event) {}

	_onKeyDownHandler(event) {}
}
