/**
 * @module seng-event
 */
import BaseEvent from './BaseEvent';

/**
 * @ignore
 */
type TypeMap<TType extends string> = { [P in TType]: P };

/**
 * @ignore
 */
interface EventTypeClass<TData, TType extends string> {
  types: TypeMap<TType>;
  new (type: TType, data: TData): BaseEvent<TData, TType>;
}

function createEventType<TData>(bubbles?: boolean, cancelable?: boolean, setTimeStamp?: boolean) {
  function createEventTypeHelper<TEventTypes extends Array<string>>(
    ...types: TEventTypes
  ): EventTypeClass<TData, TEventTypes[number]> {
    class EventType extends BaseEvent<any, string> {
      public static types = types.reduce<TypeMap<string>>((result, t) => ({ ...result, t }), {});

      constructor(type: string, data: TData) {
        super(type, data, bubbles, cancelable, setTimeStamp);
      }

      public clone(): EventType {
        return new EventType(this.type, this.data);
      }
    }

    return EventType;
  }

  return createEventTypeHelper;
}

export default createEventType;
