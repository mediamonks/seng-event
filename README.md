[![Travis](https://img.shields.io/travis/mediamonks/seng-event.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/seng-event)
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
yarn add seng-event
```
or
```sh
npm i -S seng-event
```

## Basic usage

### 1. Extend the EventDispatcher class
By extending `EventDispatcher`, your class gains the ability to dispatch events using `this.dispatchEvent()`. Other code
can listen to events by calling the `addEventListener()` method on your class. For more methods, see the generated 
[API Docs](https://mediamonks.github.io/seng-event/)

```ts
import EventDispatcher from 'seng-event';

class Dog extends EventDispatcher {
  ...
}
```

### 2. Create your own event class
Create an event class that defines the structure of the events you want to dispatch. This event class should extends the
base class `AbstractEvent`. There are multiple ways of doing this:

#### Use the `createEventClass()` utiltiy
```ts
import { createEventClass } from 'seng-event';

class DogEvent extends createEventClass()('BARK','JUMP','RUN','WALK') {}
```

#### Manually extend AbstractEvent
```ts
import { AbstractEvent } from 'seng-event';

class DogEvent extends AbstractEvent {
   public static types = {
      BARK: 'BARK',
      JUMP: 'JUMP',
      RUN: 'RUN',
      WALK: 'WALK'
   };
   
   public clone():DogEvent {
       return new DogEvent(this.type);
   }
}
```
 > Note: we recommend the above convention of putting the available event types as a static member on the event. However, you are free to use any string as an event type.

#### 3. Dispatch events
```ts
const dog = new Dog();
const runHandler = (event:DogEvent) => {
  console.log('Dog is running!');
}
dog.addEventListener(DogEvent.types.RUN, runHandler);

// dispatch an event (will execute runHandler and log 'Dog is running!')
dog.dispatchEvent(new DogEvent(DogEvent.types.RUN));  
```

## Binding your EventDispatcher child class to certain event classes
If you define which events your EventDispatcher is expected to dispatch, the class will have better typings on methods like `dispatchEvent` and `addEventListener`:
```ts
class Dog extends EventDispatcher<DogEvent> {
```
You can use a union type to allow for multiple event classes:
```ts
class Dog extends EventDispatcher<DogEvent|SomeOtherEvent|AnotherEvent> {
```

## Adding data to your events
It is common to attach some data to an event that can be read from the event handler. You can implement this manually if you extend `AbstractEvent`, but this can more easily be achieved with the `createEventClass` util:
```ts
interface DogEventData {
    mood: 'happy'|'sad';
}

class DogEvent extends createEventClass<DogEventData>()('BARK','JUMP','RUN','WALK') {}
```
```ts
// creating and dispatching events in the `Dog` class:
this.dispatchEvent(new DogEvent(DogEvent.types.JUMP, { mood: 'happy' }));
```
```ts
// accessing the data
dog.addEventListener(DogEvent.types.JUMP, event => {
  console.log(`Dog jumped in a ${event.mood} mood!`);
});
```

## Cancellation, propagation and setTimestamp
The cancellation, bubbling and timestamp functionality of this libary are heavily inspired by the [DOM Event W3 spec](https://www.w3.org/TR/DOM-Level-2-Events/events.html). These options can be enabled by passing `true` to the `createEventClass` util or `AbstractEvent` constructor:
```ts
class DogEvent extends createEventClass<DogEventData>(
  true, // bubbles
  true, // cancelable
  true // setTimestamp
)('BARK','JUMP','RUN','WALK') {}
```
```ts
class DogEvent extends AbstractEvent {
   constructor(type: string) {
       super(
         type,
         true, // bubbles
         true, // cancelable
         true // setTimestamp
       );
   }
}
```
#### Cancellation
Setting `cancelable` to true allows `preventDefault` to be called on the event. Checking if `preventDefault()` has been called is up to the implementer that calls `dispatchEvent()`:
```ts
const event = new DogEvent(DogEvent.types.WALK, { mood: 'happy' });
this.dispatchEvent(event);
if (!event.defaultPrevented) {
    // do the default action here
}
```
#### Bubbling
Setting `bubbling` to `true` enables event propagation for the event if the event is dispatched on an `EventDispatcher` instance with a parent. See [this page](https://javascript.info/bubbling-and-capturing) for a general guide on how event bubbling works.
```ts
class CustomElement extends EventDispatcher<ElementEvent> {
  public name: string;
  constructor(name: string, parent: CustomElement|null = null) {
      super(parent);
      
      this.name = name;
  }
  ...
}

const elementA = new CustomElement('A');
const elementB = new CustomElement('B', elementA);
const elementC = new CustomElement('C', elementB);

elementA.addEventListener(ElementEvent.types.CLICK, (event) => {
    console.log(`The element ${event.target.name} has been clicked!`);
});

elementC.dispatchEvent(new ElementEvent(ElementEvent.types.CLICK)); // logs "The element C has been clicked!"
```

This library also supports a capturing phase. You can listen to events in the capturing phase by setting the `useCapture` parameter to `true` in the `addEventListener` method:
```ts
elementA.addEventListener(ElementEvent.types.CLICK, (event) => console.log('Capture listener on A'), true);
elementA.addEventListener(ElementEvent.types.CLICK, (event) => console.log('Bubbling listener on A'));
elementB.addEventListener(ElementEvent.types.CLICK, (event) => console.log('Capture listener on B'), true);
elementB.addEventListener(ElementEvent.types.CLICK, (event) => console.log('Bubbling listener on B'));
elementC.dispatchEvent(new ElementEvent(ElementEvent.types.CLICK));
// logs in the following order:
// Capture listener on A
// Capture listener on B
// Bubbling listener on B
// Bubbling listener on A
```

#### setTimestamp
Setting `setTimestamp` to `true` will cause a `timeStamp` property to be set on the event which is a UNIX timestamp of the time the event was dispatched.

## Isomorphic event classes
An isomorphic event class can have different data and options for each event `type`. It can be created using the `createIsomorphicEventClass` util:
```ts
interface DogEventData {
    mood: 'happy'|'sad';
}
interface DogMoveEventData extends DogEventData {
    speed: number;
}

class DogEvent extends createIsomorphicEventClass<
  [DogEventData, DogEventData, DogMoveEventData, DogMoveEventData]
>(
  {}, {}, {}, { cancelable: true }
)(
  'BARK','JUMP','RUN','WALK'
) {}
```
In the above example, a `RUN` and a `WALK` event now have a `speed` property on their event data, whereas the other events do not. In addition, all `WALK` events are cancelable.
```ts
// OK
this.dispatchEvent(new DogEvent(DogEvent.types.JUMP, { mood: 'happy' }));
this.dispatchEvent(new DogEvent(DogEvent.types.BARK, { mood: 'sad' }));
this.dispatchEvent(new DogEvent(DogEvent.types.WALK, { mood: 'sad', speed: 0 }));
// NOT OK (will give a compiler error)
this.dispatchEvent(new DogEvent(DogEvent.types.JUMP, { mood: 'happy', speed: 10 }));
this.dispatchEvent(new DogEvent(DogEvent.types.RUN, { mood: 'happy' }));
```
```ts
dog.addEventListener(DogEvent.types.JUMP, event => {
  console.log(typeof event.data.speed); // logs undefined
});
dog.addEventListener(DogEvent.types.WALK, event => {
  console.log(typeof event.data.speed); // logs "number"
  event.preventDefault(); // possible because 'WALK' is cancelable
});
```

## API documentation

View the full generated documentation [here](http://mediamonks.github.io/seng-event/).


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
yarn
```

Use one of the following main scripts:
```sh
yarn build            # build this project
yarn dev              # run compilers in watch mode, both for babel and typescript
yarn test             # run the unit tests incl coverage
yarn test:dev         # run the unit tests in watch mode
yarn lint             # run eslint and tslint on this project
yarn doc              # generate typedoc documentation
```

When installing this module, it adds a pre-commit hook, that runs lint and prettier commands
before committing, so you can be sure that everything checks out.

## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks
