import { DataForIsomorphicEvent } from './EventTypings';
import IsomorphicBaseEvent, { EventOptions, EventOptionsMap } from './IsomorphicBaseEvent';

type TypeMap<TType extends string> = { [P in TType]: P };

function createIsomorphicEventType<TDataTuple extends Array<any>>() {
  return function isomorphicStringHelper<
    TTypesTuple extends Array<string> & { length: TDataTuple['length'] }
  >(...types: TTypesTuple) {
    return function isomorphicOptionsHelper(...typeOptionsArray: Array<EventOptions>) {
      const typeOptions = types.reduce(
        (typeOptionsMap, type, index) => {
          typeOptionsMap[type] = {
            cancelable: false,
            bubbles: false,
            setTimestamp: false,
            ...(typeOptionsArray[index] || {}),
          };
          return typeOptionsMap;
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
          super(type, data, typeOptions);
        }
      };
    };
  };
}

export default createIsomorphicEventType;
