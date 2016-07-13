[![Travis](https://img.shields.io/travis/mediamonks/seng-event.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/seng-event)
[![Code Climate](https://img.shields.io/codeclimate/github/mediamonks/seng-event.svg?maxAge=2592000)](https://codeclimate.com/github/mediamonks/seng-event)
[![Coveralls](https://img.shields.io/coveralls/mediamonks/seng-event.svg?maxAge=2592000)](https://coveralls.io/github/mediamonks/seng-event?branch=master)
[![npm](https://img.shields.io/npm/v/seng-event.svg?maxAge=2592000)](https://www.npmjs.com/package/seng-event)
[![npm](https://img.shields.io/npm/dm/seng-event.svg?maxAge=2592000)](https://www.npmjs.com/package/seng-event)

# seng-event
Provides Classes and utilities for dispatching and listening to events.

Provides an _EventDispatcher_ base class that adds the ability to dispatch events and attach handlers that 
should be called when such events are triggered. New event classes can be created by extending the _AbstractEvent_
class provided in this module. This module also provides basic event classes _BasicEvent_ and _CommonEvent_ that
are ready to be used with _EventDispatcher_.

_seng-event_ also supports event capturing and bubbling phases, heavily inspired by existing event 
dispatching systems like the functionality described in the 
[DOM Event W3 spec](https://www.w3.org/TR/DOM-Level-2-Events/events.html)


## Installation

```sh
npm i -S seng-event
```

### other

We also have browser, amd, commonjs, umd, systemjs and es6 versions of
this module available attached to the [Github Releases](https://github.com/mediamonks/seng-event/releases).

## Basic usage

```ts
import EventDispatcher, {AbstractEvent} from 'seng-event';
import {generateEventTypes, EVENT_TYPE_PLACEHOLDER} from 'seng-event/lib/util/eventTypeUtils';

// extend EventDispatcher
class Foo extends EventDispatcher {
  ...
}

// Create your own event class
class FooEvent extends AbstractEvent {
   ...
   public static COMPLETE:string = EVENT_TYPE_PLACEHOLDER;
   ...
}
generateEventTypes({FooEvent});

// listener for events
const foo = new Foo();
const exampleHandler = (event:FooEvent) => 
{
  console.log('Handler called!', event.type, event.target);
}
foo.addEventListener(FooEvent.COMPLETE, exampleHandler);

// dispatch an event (will execute exampleHandler and log 'Handler called!')
foo.dispatchEvent(new FooEvent(FooEvent.COMPLETE));  
```


## Documentation

View the [generated documentation](https://rawgit.com/mediamonks/seng-event/master/doc/typedoc/index.html).


## Building

In order to build seng-event, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/mediamonks/seng-event.git
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


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks


