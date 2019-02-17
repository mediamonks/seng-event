import { DataForIsomorphicEvent } from './EventTypings';
import IsomorphicBaseEvent, { EventOptions, EventOptionsMap } from './IsomorphicBaseEvent';

type TypeMap<TType extends string> = { [P in TType]: P };

function createIsomorphicEventType<TDataTuple extends Array<any>>(
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
      >((result: any, t) => ({ ...result, t }), {} as any);

      constructor(type: TType, data: DataForIsomorphicEvent<TType, TTypesTuple, TDataTuple>) {
        super(type, data, typeOptionsMap);
      }
    };
  };
}

export default createIsomorphicEventType;
