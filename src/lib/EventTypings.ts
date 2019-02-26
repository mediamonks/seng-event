/**
 * @module seng-event/lib/EventTypings
 */

import AbstractEvent from './AbstractEvent';
import EventListenerData from './EventListenerData';
import IsomorphicBaseEvent from './IsomorphicBaseEvent';

/**
 * Extract the typeof the `type` property of an [[AbstractEvent]] (which is possibly a union)
 */
export type TypesForEvent<TEvent extends AbstractEvent> = TEvent['type'];

/**
 * Event handler for an event with the given type
 */
export type EventHandlerForEvent<TEvent extends AbstractEvent> = (event: TEvent) => any;

/**
 * Map of [[EventListenerData]] which is stored on each [[EventDispatcher]]
 */
export type EventListenerMap<TEvent extends AbstractEvent> = {
  [type: string]: Array<EventListenerData<TEvent>>;
};

/**
 * Returns the (union) type of the `type` property on an event *if and only if* that type contains
 * the given `TType`
 *
 * @example If `TEvent` is an `AbstractEvent` with `type` `'FOO'|'BAR'`, and `TType` is
 * `'BAR'`, this will return `'FOO'|'BAR'`
 *
 * @example If `TEvent` is an `AbstractEvent` with `type` `'FOO'|'BAR'`, and `TType` is
 * `'FOOBAR'`, this will return `never`
 */
export type ExtractEventTypeIfContains<
  TEvent extends AbstractEvent,
  TType extends string
> = TType extends TEvent['type'] ? TEvent['type'] : never;

/**
 * Takes a union of possible events `TEvent`, and extract only the events that contain a `type`
 * property that can possibly be `TType`
 */
export type ExtractEventIfTypeContains<
  TEvent extends AbstractEvent,
  TType extends string
> = TEvent extends { type: ExtractEventTypeIfContains<TEvent, TType> } ? TEvent : never;

/**
 * Takes an event `TEvent`. If `TEvent` extends `IsomorphicBaseEvent`, it will narrow down
 * this `IsomorphicBaseEvent` to one which has the given `TType`
 */
export type UnpackIsomorphic<
  TEvent extends AbstractEvent,
  TType extends string
> = TEvent extends IsomorphicBaseEvent<infer T, infer U, any>
  ? IsomorphicBaseEvent<T, U, TType>
  : TEvent;

/**
 * Takes a union of event types, possible created with [[createEventClass]] or
 * [[createIsomorphicEventClass]], and extracts the correct typings based on the
 * given type `TType`
 */
export type ExtractEventOfType<
  TEvent extends AbstractEvent,
  TType extends string
> = UnpackIsomorphic<ExtractEventIfTypeContains<TEvent, TType>, TType>;

// prettier-ignore
/**
 * Looks up the string literal type `T` in the tuple type `TTypes`, and returns the data
 * type that can be found at the same index on `TDataTypes`
 */
export type DataForIsomorphicEvent<
  T extends string,
  TTypes extends Array<string>,
  TDataTypes extends Array<any>
> =
  T extends TTypes[0] ? TDataTypes[0]
  : T extends TTypes[1] ? TDataTypes[1]
  : T extends TTypes[2] ? TDataTypes[2]
  : T extends TTypes[3] ? TDataTypes[3]
  : T extends TTypes[4] ? TDataTypes[4]
  : T extends TTypes[5] ? TDataTypes[5]
  : T extends TTypes[6] ? TDataTypes[6]
  : T extends TTypes[7] ? TDataTypes[7]
  : T extends TTypes[8] ? TDataTypes[8]
  : T extends TTypes[9] ? TDataTypes[9]
  : T extends TTypes[10] ? TDataTypes[10]
  : T extends TTypes[11] ? TDataTypes[11]
  : never;
