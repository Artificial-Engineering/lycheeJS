
lychee.define('app.entity.Background').includes([
	'lychee.app.sprite.Background'
]).exports(function(lychee, app, global, attachments) {

	var _texture = attachments["png"];
	var _config  = {
		repeat: true,
		states: { 'default': 0 },
		map:    { 'default': [{ x: 0, y: 0, w: 512, h: 512 }] }
	};


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		settings.texture = _texture;
		settings.repeat  = _config.repeat;
		settings.states  = _config.states;
		settings.map     = _config.map;


		lychee.app.sprite.Background.call(this, settings);

		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

