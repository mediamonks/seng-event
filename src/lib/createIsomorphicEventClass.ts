/**
 * @module seng-event
 */
import { DataForIsomorphicEvent } from './EventTypings';
import IsomorphicBaseEvent, { EventOptions, EventOptionsMap } from './IsomorphicBaseEvent';

/**
 * @ignore
 */
type TypeMap<TType extends string> = { [P in TType]: P };

/**
 * Advanced variant of the [[createEventClass]] util. Creates an _isomorphic_ event class.
 * This is an event class where the `data` property can be different for each event `type`.
 *
 * @typeparam TDataTuple A tuple type containing the types of the `data` property for
 * each event `type`. The order of this tuple corresponds to the order of the `type`
 * strings passed
 * @see For more information on the `bubbles`, `cancelable` and `setTimestamp` parameters,
 * see [[AbstractEvent]]
 * @param eventOptions Objects optionally containing the properties `bubbles`, `cancelable`
 * and `setTimestamp`. The order in which these objects are passed corresponds to the order
 * of the `type` strings passed
 *
 * @example The following snippet creates an event class with:
 *  - A `'SELECT'` event that bubbles with an `id` property on `data`
 *  - A `'CLOSE'` event that is cancelable with no `data`
 *  - A `'START'` event with an `offset` property on `data`
 * ```
 * class MyEvent extends createIsomorphicEvent<
 *   { id: string }, void, { offset: number }
 * >(
 *   { bubbles: true }, { cancelable: true }
 * )(
 *   'SELECT', 'CLOSE', 'START'
 * ) {}
 * ```
 * @returns a callback that is used to pass more parameters. See the example
 */
function createIsomorphicEventClass<TDataTuple extends Array<any>>(
  ...eventOptions: Array<EventOptions>
) {
  return function isomorphicStringHelper<
    TTypesTuple extends Array<string> & { length: TDataTuple['length'] }
  >(...types: TTypesTuple) {
    const typeOptionsMap = types.reduce(
      (res, type, index) => {
        res[type] = {
          cancelable: false,
          bubbles: false,
          setTimestamp: false,
          ...(eventOptions[index] || {}),
        };
        return res;
      },
      {} as any,
    ) as EventOptionsMap<TTypesTuple[number]>;

    return class IsomorphicEventType<
      TType extends TTypesTuple[number] = TTypesTuple[number]
    > extends IsomorphicBaseEvent<TTypesTuple, TDataTuple, TType> {
      public static types: TypeMap<TTypesTuple[number]> = types.reduce<
        TypeMap<TTypesTuple[number]>
      >((result: any, t) => ({ ...result, [t]: t }), {} as any);

      constructor(type: TType, data: DataForIsomorphicEvent<TType, TTypesTuple, TDataTuple>) {
        super(type, data, typeOptionsMap);
      }
    };
  };
}

export default createIsomorphicEventClass;
