
lychee.define('harvester.mod.Server').requires([
	'harvester.data.Filesystem',
	'harvester.data.Server'
]).exports(function(lychee, harvester, global, attachments) {

	var _MIN_PORT      = 49152;
	var _MAX_PORT      = 65534;

	var _child_process = require('child_process');
	var _net           = require('net');
	var _port          = _MIN_PORT;
	var _root          = new harvester.data.Filesystem().root;



	/*
	 * HELPERS
	 */

	var _report = function(text) {

		var lines   = text.split('\n');
		var line    = null;
		var file    = null;
		var message = null;


		if (lines.length > 0) {

			if (lines[0].indexOf(':') !== -1) {

				file = lines[0].split(':')[0];
				line = lines[0].split(':')[1];

			}


			lines.forEach(function(line) {

				var err = line.substr(0, line.indexOf(':'));
				if (err.match(/Error/g)) {
					message = line.trim();
				}

			});

		}


		if (file !== null && line !== null) {
			console.error('harvester.mod.Server: Report from ' + file + '#L' + line + ':');
			console.error('                      "' + message + '"');
		}

	};

	var _scan_port = function(callback, scope) {

		callback = callback instanceof Function ? callback : null;
		scope    = scope !== undefined          ? scope    : this;


		if (callback !== null) {

			var socket = new _net.Socket();
			var status = null;
			var port   = _port++;


			socket.setTimeout(100);

			socket.on('connect', function() {
				status = 'used';
				socket.destroy();
			});

			socket.on('timeout', function(err) {
				status = 'free';
				socket.destroy();
			});

			socket.on('error', function(err) {

				if (err.code === 'ECONNREFUSED') {
					status = 'free';
				} else {
					status = 'used';
				}

				socket.destroy();

			});

			socket.on('close', function(err) {

				if (status === 'free') {
					callback.call(scope, port);
				} else if (status === 'used') {
					_scan_port(callback, scope);
				} else {
					callback.call(scope, null);
				}

			});


			socket.connect(port, '127.0.0.1');

		}

	};

	var _serve = function(project, host, port) {

		console.info('harvester.mod.Server: BOOTUP ("' + project + ' | ' + host + ':' + port + '")');


		var server = null;

		try {

			server = _child_process.execFile(_root + project + '/harvester.js', [
				_root,
				port,
				host
			], {
				cwd: _root + project
			}, function(error, stdout, stderr) {

				stderr = (stderr.trim() || '').toString();


				if (error !== null && error.signal !== 'SIGTERM') {

					console.error('harvester.mod.Server: FAILURE ("' + project + ' | ' + host + ':' + port + '")');
					console.error(stderr);

				} else if (stderr !== '') {

					console.error('harvester.mod.Server: FAILURE ("' + project + ' | ' + host + ':' + port + '")');
					_report(stderr);

				}

			});


			server.on('SIGTERM', function() { this.exit(0); });
			server.on('error',   function() { this.exit(1); });
			server.on('exit',    function() {});

			server.destroy = function() {

				console.warn('harvester.mod.Server: SHUTDOWN ("' + project + ' | ' + host + ':' + port + '")');

				this.kill('SIGTERM');

			};

		} catch(e) {

			server = null;

		}

		return server;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'harvester.mod.Server',
				'arguments': []
			};

		},



		/*
		 * CUSTOM API
		 */

		can: function(project) {

			if (project.server === null) {

				var info = project.filesystem.info('/harvester.js');
				if (info !== null && info.type === 'file') {
					return true;
				}

			}


			return false;

		},

		process: function(project) {

			if (project.server === null) {

				var info = project.filesystem.info('/harvester.js');
				if (info !== null && info.type === 'file') {

					_scan_port(function(port) {

						if (port >= _MIN_PORT && port <= _MAX_PORT) {

							var root   = project.filesystem.root.substr(_root.length);
							var server = _serve(root, null, port);
							if (server !== null) {

								project.setServer(new harvester.data.Server({
									process: server,
									host:    null,
									port:    port
								}));

							} else {

								console.error('harvester.mod.Server: FAILURE ("' + root + ' | null:' + port + '") (chmod +x missing?)');

							}

						}

					}, this);

				}

			}

		}

	};


	return Module;

});

