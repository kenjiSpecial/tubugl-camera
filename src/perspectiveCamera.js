const EventEmitter = require('wolfy87-eventemitter');
import { mat4 } from 'gl-matrix/src/gl-matrix';
import { Vector3 } from 'tubugl-math/src/vector3';
import { Euler } from 'tubugl-math/src/euler';

export class PerspectiveCamera extends EventEmitter {
	constructor(width = window.innerWidth, height = window.innerHeight, fov = 60, near = 1, far = 1000) {
		super();

		this.position = new Vector3();
		this.rotation = new Euler();

		this._fov = fov;
		this._width = width;
		this._height = height;
		this._near = near;
		this._far = far;

		this.viewMatrix = mat4.create();
		this.projectionMatrix = mat4.create();

		this._updateViewMatrix();
		this._updateProjectionMatrix();
	}

	update(forceUpdate = false) {
		this._updateViewMatrix(forceUpdate);

		return this;
	}

	setPosition(x, y, z) {
		this.updatePosition(x, y, z);
	}

	updatePosition(x, y, z) {
		if (x !== undefined) this.position.x = x;
		if (y !== undefined) this.position.y = y;
		if (z !== undefined) this.position.z = z;

		return this;
	}

	setRotation(x, y, z) {
		this.updateRotation(x, y, z);
	}

	updateRotation(x, y, z) {
		if (x !== undefined) this.rotation.x = x;
		if (y !== undefined) this.rotation.y = y;
		if (z !== undefined) this.rotation.z = z;

		return this;
	}

	/**
	 *
	 * @param {Array}targetPosition
	 */
	lookAt(targetPosition) {
		if (Array.isArray(targetPosition)) mat4.lookAt(this.viewMatrix, this.position.array, targetPosition, [0, 1, 0]);
		else mat4.lookAt(this.viewMatrix, this.position.array, targetPosition.array, [0, 1, 0]);

		mat4.invert(this.rotation.matrix, this.viewMatrix);
		this.rotation.setFromRotationMatrix(this.rotation.matrix);

		this.needsUpdate = false;

		return this;
	}

	log() {
		console.log(
			`[PerspectiveCamera] position: {x: ${this.position.x}, y: ${this.position.y}, z: ${this.position.z} }`
		);
		console.log(
			`[PerspectiveCamera] rotation: {x: ${this.rotation.x}, y: ${this.rotation.y}, z: ${this.rotation.z} }`
		);
	}

	updateSize(width, height) {
		this._width = width;
		this._height = height;

		this._updateProjectionMatrix();
	}

	updateFov(fov) {
		this._fov = fov;

		this._updateProjectionMatrix();
	}

	updateDistance(near, far) {
		if (near) this._near = near;
		if (far) this._far = far;

		this._updateProjectionMatrix();
	}

	_updateProjectionMatrix() {
		mat4.perspective(
			this.projectionMatrix,
			this._fov / 180 * Math.PI,
			this._width / this._height,
			this._near,
			this._far
		);
	}

	_updateViewMatrix(forceUpdate = false) {
		if (!this.needsUpdate && !forceUpdate) return;

		mat4.copy(this.viewMatrix, this.rotation.matrix);
		this.viewMatrix[12] = this.position.array[0];
		this.viewMatrix[13] = this.position.array[1];
		this.viewMatrix[14] = this.position.array[2];
		mat4.invert(this.viewMatrix, this.viewMatrix);

		this.needsUpdate = false;

		return this;
	}
}
