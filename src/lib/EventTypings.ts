import AbstractEvent from './AbstractEvent';
import EventListenerData from './EventListenerData';
import IsomorphicBaseEvent from './IsomorphicBaseEvent';

export type TypesForEvent<TEvent extends AbstractEvent> = TEvent['type'];

export type EventHandlerForEvent<TEvent extends AbstractEvent> = (event: TEvent) => any;

export type EventListenerMap<TEvent extends AbstractEvent> = {
  [type: string]: Array<EventListenerData<TEvent>>;
};

export type ExtractEventTypeIfContains<
  TEvent extends AbstractEvent,
  TType extends string
> = TType extends TEvent['type'] ? TEvent['type'] : never;

export type ExtractEventIfTypeContains<
  TEvent extends AbstractEvent,
  TType extends string
> = TEvent extends { type: ExtractEventTypeIfContains<TEvent, TType> } ? TEvent : never;

export type UnpackIsomorphic<
  TEvent extends AbstractEvent,
  TType extends string
> = TEvent extends IsomorphicBaseEvent<infer T, infer U, any>
  ? IsomorphicBaseEvent<T, U, TType>
  : TEvent;

export type ExtractEventOfType<
  TEvent extends AbstractEvent,
  TType extends string
> = UnpackIsomorphic<ExtractEventIfTypeContains<TEvent, TType>, TType>;

// prettier-ignore
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
