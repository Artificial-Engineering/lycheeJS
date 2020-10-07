
# Project Files

Every lychee.js Project and Library has the
same setup of the Filesystem structure.

This allows to have a generic way of compiling,
analyzing, building, updating and injecting
Definitions across multiple machines running
on multiple platforms.

It is heavily recommended to always use the
same Filesystem structure as suggested in
the [Boilerplate](https://github.com/Artificial-Engineering/lycheejs/tree/development/projects/boilerplate).


## Filesystem Structure

Each file in the `/api`, `/asset`, `/build`, `/review` and
`/source` folder is completely integrated with the
[lychee.pkg](./Package-Format.md) file.

The [MAIN Architecture](./MAIN.md) explains how
all the structured Definitions are integrated in
a centralized `app.Main` Definition.

Note that most namespaces follow a behaviour-reflecting
naming scheme which is reused by [lychee.js Studio](../software-bots/lycheejs-studio.md).

If the naming scheme is followed correctly, automated
imports and exports are available. The [Definitions](../engine-concept/Definitions.md)
and [Code Rules](../engine-concept/Code-Rules.md) sections
explain this more in detail.


This is an example project that demonstrates a
typical Project's filesystem structure. All projects
and libraries follow the same filesystem conventions:

```bash
/projects/example
|
+-- /bin               - Fertilizer Integration
| +-- configure.sh
| +-- build.sh
| +-- package.sh
| +-- publish.sh
| |
+-- /api               - API Knowledge (generated by lychee.js Strainer)
+-- /asset             - RAW Assets (imported by lychee.js Studio)
+-- /build             - build variants (generated by lychee.js Harvester)
+-- /libraries         - isolated libraries (pulled by lychee.js Breeder)
+-- /review            - review variants (simulated by lychee.js Fertilizer and lychee.js Strainer)
|
|
+-- /source            - source variant
| |
| |
| +-- /ai              - Game/App AI
| | +-- Agent.js       - app.ai.Agent
| |
| +-- /policy
| | +-- Custom.js      - app.policy.Custom
| |
| |
| +-- /app
| | +-- /entity        - App Entities
| | +-- /layer         - App Layers
| | +-- /sprite        - App Sprites
| | | +-- Custom.js    - app.sprite.Custom
| | | +-- Custom.png   - app.sprite.Custom
| |
| |
| +-- /ui
| | +-- /entity        - UI Entities
| | +-- /layer         - UI Layers
| | +-- /sprite        - UI Sprites
| |
| |
| +-- /net             - Game/App Networking
| | +-- /client
| | | +-- Ping.js      - app.net.client.Ping
| | +-- /remote
| | | +-- Ping.js      - app.net.remote.Ping
| | |
| | +-- Client.js      - app.net.Client
| | +-- Server.js      - app.net.Server
| |
| |
| +-- /state           - App States
| | +-- Welcome.js     - app.state.Welcome
| | +-- Welcome.json
| | +-- Another.js     - app.state.Another
| | +-- Another.json
| |
| |
| +-- Main.js          - MAIN (See MAIN Architecture)
|
|
+-- harvester.js       - Harvester Integration (isomorphic server)
+-- icon.png           - Game/App Icon (256x256)
+-- index.html         - Development (source) variant entry point
+-- lychee.pkg         - lychee.Package
+-- lychee.store       - lychee.Storage (synchronized across all peers)
```

**Automated Folders**

The `/api` folder is generated by the [lychee.js Strainer](../software-bots/lycheejs-strainer.md)
and contains all parsed information about the source code.
This data is in machine-readable state as JSON files, so
that it can be directly synchronized to other instances.

The `/asset` folder contains all raw assets that are not
readable by lychee.js. For example, it may contain the
source SVG or PSD files or the raw audio files.

The `/build` folder is completely generated by the
[lychee.js Harvester](../software-bots/lycheejs-harvester.md)
and [lychee.js Fertilizer](../software-bots/lycheejs-fertilizer.md).
It contains all build variants of the application,
dependent on which build environments are set up inside
the `lychee.pkg` file and its `/build/environments`
section which is described in the [Package Format](./Package-Format.md).

**Unautomated Folders**

The `/bin` folder contains all the integration shell
scripts for the different build steps of the
[lychee.js Fertilizer](../software-bots/lycheejs-fertilizer.md).

The build steps follow this specific order, and the
project-specific shell scripts are called right after
the equivalent step was executed by the platform-specific
build template:

1. `/bin/configure.sh` prepares all settings and (possibly) makefiles.
2. `/bin/build.sh` executes the build process and builds binaries.
3. `/bin/package.sh` packages the binary into different package formats.
4. `/bin/publish.s` (optionally) deploys the packages to a server.

As there are no specific rules for the integration shell
scripts, they can do pretty much anything to integrate
external compiler or build toolchains.

The only parameter those integration shell scripts receive
is the `id` of the build environment, which is equivalent
to the `lychee.pkg/build/environments/<id>` value.

The `/source` folder contains all the source code of
the Project or Library. It is untouched by the [lychee.js Harvester](../software-bots/lycheejs-harvester.md)
and the folder that humans are allowed to work in.


## Harvester Integration (harvester.js)

The [lychee.js Harvester](../software-bots/lycheejs-harvester.md)
starts the `harvester.js` that extends the Project
or Library with features like live-updates,
auto-fertilization, fuzz-testing, apidoc-generation
and automatic stash and storage synchronization across
networked peers.

Hint: The [lychee.js Helper](../software-bots/lycheejs-helper.md)
allows to start an isolated server-side instance
without having to restart the [lychee.js Harvester](../software-bots/lycheejs-harvester.md)
all the time.


```bash
cd /opt/lycheejs;

# Parameter Syntax of harvester.js:
# PORT (HOST || null)

cd ./projects/example;
lycheejs-helper env:node ./harvester.js 1337 localhost;
```


## Development Variant (index.html)

The `index.html` of each project is the URL that
you can use to develop the project in a Blink-based
Browser.

It is heavily recommended (can't stress it enough)
to use a Blink-based Browser like Chrome, Chromium
or Opera as a development environment as the debugging
tools allow better integration with the `lychee.Debugger`.

Other Browsers do not have the same debugging capabilities,
so you will heavily worsen your development experience when
using them.


If the [lychee.js Harvester](../software-bots/lycheejs-harvester.md)
is running (recommended), a Project at the path
`/projects/example` is available via
`http://localhost:8080/projects/example/` with
the `development` profile.
