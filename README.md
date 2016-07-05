[![Travis](https://img.shields.io/travis/mediamonks/seng-event.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/seng-event)
[![Code Climate](https://img.shields.io/codeclimate/github/mediamonks/seng-event.svg?maxAge=2592000)](https://codeclimate.com/github/mediamonks/seng-event)
[![Coveralls](https://img.shields.io/coveralls/mediamonks/seng-event.svg?maxAge=2592000)](https://coveralls.io/github/mediamonks/seng-event?branch=master)
[![npm](https://img.shields.io/npm/v/seng-event.svg?maxAge=2592000)](https://www.npmjs.com/package/seng-event)
[![npm](https://img.shields.io/npm/dm/seng-event.svg?maxAge=2592000)](https://www.npmjs.com/package/seng-event)

# seng-event

Add a description here...


## Installation

```sh
npm i -S seng-event
```

Or grab one of the following files from the `/dist/` folder for manual use:

- **umd** (bundled with webpack)
- **amd** (bundled with webpack)
- **commonjs2** (bundled with webpack, but why don't you use npm?)
- **browser** (bundled with webpack, available as `window.SengEvent`)
- **system**
- **es6**

## Usage

```ts
import SengEvent from 'seng-event';
// import SengEvent from 'seng-event/lib/classname';

// do something with SengEvent
```


## Documentation

View the [generated documentation](https://rawgit.com/MediaMonks/seng-event/master/doc/typedoc/index.html).


## Building

In order to build seng-event, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/MediaMonks/seng-event.git
```

Change to the seng-event directory:
```sh
cd seng-event
```

Install dev dependencies:
```sh
npm install
```

Use one of the following main scripts:
```sh
npm run build   		# build this project
npm run generate   		# generate all artifacts (compiles ts, webpack, docs and coverage)
npm run typings			# install .d.ts dependencies (done on install)
npm run test-unit    	# run the unit tests
npm run validate		# runs validation scripts, including test, lint and coverage check
npm run lint			# run tslint on this project
npm run doc				# generate typedoc and yuidoc documentation
npm run typescript-npm	# just compile the typescript output used in the npm module
```

When installing this module, it adds a pre-commit hook, that runs the `validate`
script before committing, so you can be sure that everything checks out.

## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks


