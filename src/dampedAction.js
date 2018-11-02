export class DampedAction {
	constructor() {
		this.value = 0.0;
		this.damping = 0.85;
	}

	addForce(force) {
		this.value += force;
	}

	/** updates the damping and calls {@link damped-callback}. */
	update() {
		let isActive = this.value * this.value > 0.000001;
		if (isActive) {
			this.value *= this.damping;
		} else {
			this.stop();
		}
		return this.value;
	}

	/** stops the damping. */
	stop() {
		this.value = 0.0;
	}
}
