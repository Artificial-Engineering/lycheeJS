lychee.define('fertilizer.event.flow.Configure').includes([
	'fertilizer.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Flow = lychee.import('fertilizer.event.Flow');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		_Flow.call(this, states);

		states = null;



		/*
		 * FLOW
		 */

		this.then('configure-project');

		// this.then('read-package');
		// this.then('read-assets');
		// this.then('read-assets-crux');

		// this.then('build-environment');
		// this.then('build-assets');
		// this.then('write-assets');
		// this.then('build-project');

		// this.then('package-runtime');
		// this.then('package-project');

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.event.flow.Configure';


			return data;

		}


	};


	return Composite;

});
