import AbstractEvent from './AbstractEvent';
import EventListenerData from './EventListenerData';
import IsomorphicBaseEvent from './IsomorphicBaseEvent';

export type TypesForEvent<TEvent extends AbstractEvent> = TEvent['type'];

export type EventHandlerForEvent<TEvent extends AbstractEvent> = (event: TEvent) => any;

export type EventListenerMap<TEvent extends AbstractEvent> = { [type: string]: Array<EventListenerData<TEvent>> };

/**
 * Returns all TEvent['type'] that contain TType
 *
 * example
 * TEvent = { type: 'FOO'|'BAR' }|{ type: 'FOOBAR' }
 * TType = 'BAR'
 * ExtractEventType<TEvent, TType> = 'FOO'|'BAR'
 */
type ExtractEventTypeIfContains<TEvent extends AbstractEvent, TType extends string> =
  TType extends TEvent['type'] ? TEvent['type'] : never;

/**
 * Returns all TEvent['type'] that contain TType
 *
 * example
 * TEvent = { type: 'FOO'|'BAR', ... }|{ type: 'FOOBAR', ... }
 * TType = 'BAR'
 * ExtractEventsContainsType<TEvent, TType> = { type: 'FOO'|'BAR', ... }
 */
type ExtractEventIfTypeContains<TEvent extends AbstractEvent, TType extends string> =
  TEvent extends { type: ExtractEventTypeIfContains<TEvent, TType> } ? TEvent : never;

/**
 * If TEvent is an IsomorphicEvent (extends IsomorphicBaseEvent), narrow TEvent down to the
 * IsomorphicBaseEvent with TType.
 *
 * Example:
 * const FooEvent = createIsomorphicEventType<
 * 'CREATE',{ createId: number },'CHANGE',{ createId: number, newValue: string }
 * >({ CREATE: {}, CHANGE: { bubbles: true });
 * type FooEventType = InstanceType<typeof FooEvent>;
 *
 * const BarEvent = createEventType<{ barId: string }>()(['CREATE_BAR']);
 * type BarEventType = InstanceType<typeof BarEvent>;
 *
 * TEvent = FooEvent | BarEvent;
 * TType = 'CREATE';
 * UnpackIsomorphic<TEvent, TType> = FooEvent<'CREATE'> | BarEvent
 */
type UnpackIsomorphic<TEvent extends AbstractEvent, TType extends string> =
  TEvent extends IsomorphicBaseEvent<infer T, infer U, any> ? IsomorphicBaseEvent<T, U, TType> : TEvent;

export type ExtractEventsOfType<TEvent extends AbstractEvent, TType extends string> =
  UnpackIsomorphic<ExtractEventIfTypeContains<TEvent, TType>, TType>;

