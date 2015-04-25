
lychee.define('lychee.net.remote.Debugger').requires([
	'lychee.Storage'
]).includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	var _connections = {};
	var _tunnels     = [];

	var _storage     = new lychee.Storage({
		id:   'server',
		type: lychee.Storage.TYPE.persistent
	});



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(remote) {

		lychee.net.Service.call(this, 'debugger', remote, lychee.net.Service.TYPE.remote);



		/*
		 * INITIALIZATION
		 */

		this.bind('plug', function() {

			_tunnels.push(this.tunnel);

		}, this);

		this.bind('unplug', function() {

			var index = _tunnels.indexOf(this.tunnel);
			if (index !== -1) {
				_tunnels.splice(index, 1);
			}

		}, this);

		this.bind('connect', function(data) {

			_storage.sync();


			var master = this.tunnel.host + ':' + this.tunnel.port;
			var slave  = data.id || null;

			if (slave !== null) {

				var object = _storage.filter(function(obj) {
					return obj.id === slave;
				})[0] || null;

				if (object !== null) {
					object.state = 'debug';
					_storage.update(object);
				}


				var remote = _tunnels.find(function(remote) {
					return (remote.host + ':' + remote.port) === slave;
				}) || null;

				if (remote !== null) {

					var slaves = _connections[master] || null;
					if (slaves === null) {
						slaves = _connections[master] = [];
					}

					if (slaves.indexOf(remote) === -1) {
						slaves.push(remote);
					}

				}

			}

		}, this);

		this.bind('execute', function(data) {

			_storage.sync();


			var master = this.tunnel.host + ':' + this.tunnel.port;
			var slaves = _connections[master] || null;

			if (slaves instanceof Array) {

				slaves.forEach(function(remote) {

					remote.send(data, {
						id:    'debugger',
						event: 'execute'
					});

				});

			}

		}, this);

		this.bind('disconnect', function(data) {

			var master = this.tunnel.host + ':' + this.tunnel.port;
			var slave  = data.id || null;

			if (slave !== null) {

				var object = _storage.filter(function(obj) {
					return obj.id === slave;
				})[0] || null;

				if (object !== null) {
					object.state = 'default';
					_storage.update(object);
				}


				var remote = _tunnels.find(function(remote) {
					return (remote.host + ':' + remote.port) === slave;
				}) || null;

				if (remote !== null) {

					var index = _connections[master].indexOf(remote);
					if (index !== -1) {
						_connections[master].splice(index, 1);
					}

				}

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
