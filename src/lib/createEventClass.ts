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

function createEventClass<TData = void>(
  bubbles?: boolean,
  cancelable?: boolean,
  setTimeStamp?: boolean,
) {
  function createEventClassHelper<TEventTypes extends Array<string>>(
    ...types: TEventTypes
  ): EventTypeClass<TData, TEventTypes[number]> {
    class GenerateEventClass extends BaseEvent<any, string> {
      public static types = types.reduce<TypeMap<string>>(
        (result, t) => ({ ...result, [t]: t }),
        {},
      );

      constructor(type: string, data: TData) {
        super(type, data, bubbles, cancelable, setTimeStamp);
      }
    }

    return GenerateEventClass;
  }

  return createEventClassHelper;
}

export default createEventClass;
