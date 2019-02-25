# V2.0.0

## New features
Most new features are centered around better typings

### EventDispatcher can be restricted to certain event classes
You can now pass a generic parameter to `EventDispatcher` indicating
which type of events it will dispatch. Besides it being documentation to
other developers about which events to expect, it also allows this library
to add more useful typings to methods like `addEventListener`. Example:

```ts
class Scheduler extends EventDispatcher<SchedulerEvent> {
```

### It is now easier to create event classes
Event classes can still be created by manually extending `AbstractEvent`.
However, this is somewhat verbose. Moreover, it is very common to want to
have some kind of `data` property on an event. This is now possible using
2 new utilities: `createEventClass` and `createIsomorphicEventClass`. See
the [readme](README.md) for more info.

### Event classes can have isomorphic data or options
Previously an event class was either fixed to a set of options and a certain
type of `data`, or it was typed too loosely. It is now possible to have the
options and the `data` depend on the event `type`. 

## Changes

### Static string types on Event classes
Instead of the types being available directly on the class constructor,
they are now nested in a `types` property:

```ts
foo.addEventListener(new SomeEvent(SomeEvent.types.FOO, ...));
```

### Private fields

A lot of `private` fields have been changed to `protected` to allow for
more extensibility

## Removals

### Removed `CommonEvent` and `BasicEvent`
As it is now very easy to create your own strongly typed event classes,
it no longer makes sense to export generic classes. Instead, we
should encourage the definition of classes tailored to your project.

### Removed `IEventDispatcher` and `IEvent`
These interfaces contain a lot of duplication with their corresponding 
classes, and were slowing down development. Typing things like so will 
also remove the strong typing. The rationale behind it was that we 
theoretically could have `EventDispatcher` interact with a custom
implementation with the same interface, but this is rarely to never done.
When wanting some kind of custom functionality, it usually suffices to 
extend `EventDispatcher` and override the methods. 

It's also worth mentioning that there was no advantage to `IEvent` at all,
as `AbstractEvent` only has public members. This makes it possible to 
create a class that `implements AbstractEvent`.

### Removed `eventTypeUtils` (like `generateEventTypes`)
Our new `createEventClass` utility has a better syntax

## Testing
Tests are now implemented using Jest. Additional test have been added using 
`dtslint`, allowing us to do assertions on the types in the TypeScript compiler.

## Compatibility
Requires at least TypeScript 3.1, for the [mapped tuple type](https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#mapped-types-on-tuples-and-arrays)
functionality.
