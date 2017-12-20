const EventEmitter = require('wolfy87-eventemitter');
import { mat4 } from 'gl-matrix/src/gl-matrix';

/**
 * if you forget order of matrix to shader
 * http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
 */

export class PerspectiveCamera extends EventEmitter {
	constructor(position = [0, 0, 0], rotation = [0, 0, 0]) {
        this._position = position;
        this._rotation = rotation;


    }
    log(){

	    console.log(`[PerspectiveCamera]: position(x, y, z): (${this._position[0]}, ${this._position[1]}, ${this._position[2]})`);
	    console.log(`[PerspectiveCamera]: rotation(x, y, z): (${this._position[0]}, ${this._position[1]}, ${this._position[2]})`));

    }
}
