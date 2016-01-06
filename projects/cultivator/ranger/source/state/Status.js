
lychee.define('tool.state.Status').includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	/*
	 * HELPERS
	 */

	var _ui_update = function() {

		var config = new Config('http://localhost:4848/api/Project?timestamp=' + Date.now());
		var that   = this;

		config.onload = function(result) {
			_ui_render.call(that, this.buffer);
		};

		config.load();

	};

	var _ui_render = function(buffer) {

		if (buffer instanceof Array) {

			var main = this.main || null;
			if (main !== null) {

				var code        = '';
				var port        = 80;
				var reverse_map = {};
				var projects    = buffer.filter(function(project) {
					return !project.identifier.match(/harvester/);
				});
				var harvester   = buffer.filter(function(project) {
					return project.identifier.match(/harvester/);
				})[0] || null;


				if (projects.length > 0) {
					projects.forEach(function(project) {
						reverse_map[project.identifier] = [];
					});
				}


				code += '<table>';

				if (harvester !== null) {

					code += '<tr>';
					code += '<th>Host</th>';
					code += '<th>Status</th>';
					code += '<th>Projects</th>';
					code += '<th>Actions</th>';
					code += '</tr>';


					if (harvester.server !== null) {
						port = harvester.server.port;
					}


					Object.keys(harvester.details).forEach(function(identifier) {

						var host_projects = [ '*' ];

						if (harvester.details[identifier] instanceof Array) {

							harvester.details[identifier].forEach(function(id) {

								var map = reverse_map[id];
								if (map === undefined) {
									map = reverse_map[id] = [];
								}

								map.push(identifier);

							});

							host_projects = harvester.details[identifier];

						}


						var pretty_host = identifier + ':' + port;
						if (identifier.match(/:/)) {
							pretty_host = '[' + identifier + ']:' + port;
						}


						code += '<tr>';
						code += '<td>' + identifier + '</td>';
						code += '<td><label class="ico-online">Online</label></td>';
						code += '<td>' + host_projects.join(', ') + '</td>';
						code += '<td><a class="button ico-browser ico-only" title="Open in Browser" href="lycheejs://web=' + encodeURI('http://' + pretty_host) + '"></a></td>';
						code += '</tr>';

					});


					Object.keys(harvester.details).forEach(function(identifier) {

						if (harvester.details[identifier] === null) {

							for (var id in reverse_map) {
								reverse_map[id].push(identifier);
							}

						}

					});

				}


				code += '<tr class="div"></tr>';


				if (projects.length > 0) {

					code += '<tr>';
					code += '<th>Project</th>';
					code += '<th>Status</th>';
					code += '<th>Hosts</th>';
					code += '<th>Actions</th>';
					code += '</tr>';


					projects.forEach(function(project) {

						var project_hosts   = reverse_map[project.identifier];
						var project_actions = [];
						var project_status  = '';

						if (project.server === null) {

							if (project.harvester === true) {
								project_actions.push('<a class="button ico-start ico-only" title="Start Project Server" href="lycheejs://start=' + project.identifier + '"></a>');
								project_status = '<label class="ico-offline">Offline</label>';
							} else {
								project_actions.push('<button class="ico-start ico-only" disabled></button>');
								project_status = '<label class="ico-offline" disabled>Offline</label>';
							}

						} else {
							project_actions.push('<a class="button ico-stop ico-only" title="Stop Project Server" href="lycheejs://stop=' + project.identifier + '"></a>');
							project_status = '<label class="ico-online">Online</label>';
						}


						if (project.filesystem !== null) {
							project_actions.push('<a class="button ico-folder ico-only" title="Open Project Folder" href="lycheejs://file=' + project.identifier + '"></a>');
						}


						if (project.identifier !== 'lychee' && project_hosts.length > 0) {

							project_hosts.forEach(function(host) {

								var pretty_host = host + ':' + port;
								if (host.match(/:/)) {
									pretty_host = '[' + host + ']:' + port;
								}

								if (harvester !== null && harvester.details[host] === null) {
									project_actions.push('<a class="button ico-browser ico-only" title="Open in Browser" href="lycheejs://web=' + encodeURI('http://' + pretty_host + '/projects/' + project.identifier) + '"></a>');
								} else {
									project_actions.push('<a class="button ico-browser ico-only" title="Open in Browser" href="lycheejs://web=' + encodeURI('http://' + pretty_host) + '"></a>');
								}

							});

						}


						code += '<tr>';
						code += '<td>' + project.identifier + '</td>';
						code += '<td>' + project_status + '</td>';
						code += '<td>' + project_hosts.join(', ') + '</td>';
						code += '<td>' + project_actions.join('') + '</td>';
						code += '</tr>';

					});

				}

				code += '</table>';


				ui.render(code, 'section.active');

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);
		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize:   function() {},
		deserialize: function() {},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {
			_ui_update.call(this);
		},

		enter: function() {
			_ui_update.call(this);
		},

		leave: function() {
			_ui_render.call(this, null);
		}

	};


	return Class;

});

