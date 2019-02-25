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

/**
 * Utility function to generate a class that extends [[AbstractEvent]] and optionally has
 * a `data` property.
 *
 * @typeparam TData The type of the `data` parameter that must be passed to the constructor,
 * and is made available as a `data` property on the event. If not set, the type is `void`
 * and no `data` property will be set
 * @see For more information on the `bubbles`, `cancelable` and `setTimestamp` parameters,
 * see [[AbstractEvent]]
 * @param bubbles Specifies if event bubbling is enabled for this event. Defaults to
 * `false`.
 * @param cancelable Specifies if this events supports cancellation. Defaults to
 * `false`
 * @param setTimeStamp If `true`, stores a timestamp of the construction time on the event.
 * Defaults to `false`.
 * @returns A callback that is used to pass the string event types. See the examples
 * for more info.
 * @example The recommended syntax is to use `createEventClass` in an `extends` clause:
 * ```
 * class MyEvents extends createEventClass(true)('START', 'STOP') {}
 * ```
 * @example You can also store the result in a `const`, but the result then cannot be
 * used as a type within TypeScript:
 * ```
 * const MyEvent = createEventClass(false, true)('START', 'STOP');
 * const myEventInstance:MyEvent; // <= not possible
 * ```
 * @example set the generic type parameter to specify a `data` property on the event:
 * ```
 * class MyEvents extends createEventClass<{ id: number }>()('START', 'STOP') {}
 *
 * const myEventInstance = new MyEvent(
 *   'START',  // <= must be either 'START' or 'STOP',
 *   { id: 4 } // <= must be of type { id: number }
 * );
 * ```
 */
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
