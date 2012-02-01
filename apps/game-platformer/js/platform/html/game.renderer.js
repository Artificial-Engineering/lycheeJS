
game.renderer = function(view, debug) {

	if (!view instanceof ly.view) {
		throw 'Need a View instance to work properly';
	}


	this._view = view;
	this.debug = debug || null;

	this.__state = null;

	// TODO: Does it makes sense to have an initial reset?
	// Maybe dependend on the view?
	// this.reset();

};


game.renderer.prototype = {

	/*
	 * PUBLIC API
	 */
	start: function() {
		if (this.__state !== 'running') {
			this.__state = 'running';
		}
	},

	stop: function() {
		this.__state = 'stopped';
	},

	isRunning: function() {
		return this.__state === 'running';
	},

	reset: function(width, height, resetCache) {

		if (resetCache === true) {
			this.__cache = {};
		}

		var viewport = this._view.get('viewport');

		this.__canvas = document.createElement('canvas');
		this.__ctx = this.__canvas.getContext('2d');

		this.__canvas.width = width;
		this.__canvas.height = height;

		this._view.setContext(this.__canvas);

		// required for requestAnimationFrame
		this.context = this.__canvas;

	},

	clear: function() {

		if (this.__state !== 'running') return;

		this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);

	},

	drawBox: function(x1, y1, x2, y2, color) {

		color = typeof color === 'string' ? color : '#000';

		throw 'Not implemented yet';

	},

	drawSprite: function(sprite, x, y, index) {

		sprite = Object.prototype.toString.call(sprite) === '[object Object]' ? sprite : null;
		index = typeof index === 'number' ? index : 0;

		if (sprite === null) return;

		this.__ctx.drawImage(
			sprite[index],
			x,
			y
		);

	},

	drawText: function(text, x, y, sprite, color) {

		sprite = Object.prototype.toString.call(sprite) === '[object Object]' ? sprite : null;
		color = typeof color === 'string' ? color : '#000';

		// bitmap rendering
		if (sprite !== null) {

		} else {
		}

	},




	refresh: function(delta) {

		if (this.__state !== 'running') return;

		// clear the last frame
		var viewport = this._view.get('viewport');
		this.__ctx.clearRect(0, 0, viewport.size.x * viewport.tile, viewport.size.y * viewport.tile);


		// refresh ui
		if (this._status !== undefined) {

			var score = this._status.get('score');

			// throw "NEXT TODO: render UI and its abstraction layer for layouting.";

		}

	},

	/*
	 * This function will render per-Object.
	 * The delta is used for animation timings.
	 *
	 * @param {ly.object} object The rendered Object
	 * @param {Number} delta The delta in milliseconds
	 */
	refreshObject: function(object, delta) {

		if (this.__state !== 'running') return;


		// Model is required for Rendering
		var model = object.model;
		if (model === null) return;


		var position = object.position,
			viewport = this._view.get('viewport'),
			tile = viewport.tile,
			posX = Math.round((position.x - (viewport.position.x - viewport.size.x / 2)) * tile),
			posY = Math.round((viewport.size.y - position.y + (viewport.position.y - viewport.size.y / 2)) * tile),
			bb = model.get('boundingBox');


		// Render available Sprite
		if (this.__spriteCache[model.id] !== undefined) {

			var sprite = this.__spriteCache[model.id],
				spriteState = model.getState(model.get('state')).sprite;

			this.__ctx.drawImage(
				sprite.image,
				posX + spriteState.x,
				posY + spriteState.y
			);

		} else {

			var sprite = model.sprite;
			if (sprite !== null) {
				this.__spriteCache[model.id] = sprite;
			}

		}


		// Render boundingBoxes for debugging
		if (bb !== null && this.debug !== null) {

			// Render Position Rectangle
			this.__ctx.fillStyle = 'red';
			this.__ctx.fillRect(posX - 5, posY - 5, 9, 9);

			this.__ctx.beginPath();

			// Render BoundingBox
			this.__ctx.moveTo(posX + bb.minX * tile, posY + (-1 * bb.minY * tile));
			this.__ctx.lineTo(posX + bb.maxX * tile, posY + (-1 * bb.minY * tile));
			this.__ctx.lineTo(posX + bb.maxX * tile, posY + (-1 * bb.maxY * tile));
			this.__ctx.lineTo(posX + bb.minX * tile, posY + (-1 * bb.maxY * tile));
			this.__ctx.lineTo(posX + bb.minX * tile, posY + (-1 * bb.minY * tile));

			this.__ctx.lineWidth = 2;
			this.__ctx.strokeStyle = 'red';
			this.__ctx.stroke();
			this.__ctx.closePath();

		}

	}

};
