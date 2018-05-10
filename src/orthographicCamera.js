import EventEmitter from 'wolfy87-eventemitter';
import {
	mat4
} from 'gl-matrix/src/gl-matrix';
import {
	Vector3
} from 'tubugl-math/src/vector3';
import {
	Euler
} from 'tubugl-math/src/euler';

export class OrthographicCamera extends EventEmitter {
	constructor(
		left = -window.innerWidth / 2,
		right = window.innerWidth / 2,
		top = window.innerHeight / 2,
		bottom = -window.innerHeight / 2,
		near = 1,
		far = 1000
	) {
		super();

		this.position = new Vector3();
		this.rotation = new Euler();

		this._left = left;
		this._right = right;
		this._top = top;
		this._bottom = bottom;
		this._near = near;
		this._far = far;

		this.needsUpdate = true;

		this.viewMatrix = mat4.create();
		this.projectionMatrix = mat4.create();

		setTimeout(() => {
			this._updateViewMatrix();
			this._updateProjectionMatrix();
		}, 0);
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
			`[orthographicCamera] position: {x: ${this.position.x}, y: ${this.position.y}, z: ${this.position.z} }`
		);
		console.log(
			`[orthographicCamera] rotation: {x: ${this.rotation.x}, y: ${this.rotation.y}, z: ${this.rotation.z} }`
		);
	}

	updateSize(left, right, top, bottom) {
		this._left = left;
		this._right = right;
		this._top = top;
		this._bottom = bottom;

		this._updateProjectionMatrix();
	}

	updateDistance(near, far) {
		if (near) this._near = near;
		if (far) this._far = far;

		this._updateProjectionMatrix();
	}

	_updateProjectionMatrix() {
		mat4.ortho(this.projectionMatrix, this._left, this._right, this._bottom, this._top, this._near, this._far);
	}

	_updateViewMatrix(forceUpdate = false) {
		if (!this.rotation.needsMatrixUpdate && !this.needsUpdate && !forceUpdate) return;

		this.rotation.updateMatrix();
		mat4.copy(this.viewMatrix, this.rotation.matrix);
		this.viewMatrix[12] = this.position.array[0];
		this.viewMatrix[13] = this.position.array[1];
		this.viewMatrix[14] = this.position.array[2];
		mat4.invert(this.viewMatrix, this.viewMatrix);

		this.needsUpdate = false;

		return this;
	}
}