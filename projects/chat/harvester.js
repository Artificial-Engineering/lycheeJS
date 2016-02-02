#!/usr/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

var _root = process.argv[2];
var _port = parseInt(process.argv[3], 10);
var _host = process.argv[4] === 'null' ? null : process.argv[4];

require(_root + '/libraries/lychee/build/node/core.js')(__dirname);



/*
 * INITIALIZATION
 */

(function(lychee, global) {

	var environment = new lychee.Environment({
		debug:    false,
		sandbox:  false,
		build:    'app.net.Server',
		packages: [
			new lychee.Package('app', './lychee.pkg')
		],
		tags:     {
			platform: [ 'node' ]
		}
	});


	lychee.setEnvironment(environment);

	lychee.init(function(sandbox) {

		var lychee = sandbox.lychee;
		var app    = sandbox.app;

		sandbox.SERVER = new app.net.Server({
			host: _host,
			port: _port
		});

	});

})(lychee, typeof global !== 'undefined' ? global : this);

