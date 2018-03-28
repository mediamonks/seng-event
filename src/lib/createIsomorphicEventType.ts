import {
  IEventOptionsMap,
  default as IsomorphicBaseEvent,
  TypeMap,
  DataForIsomorphicEvent,
} from './IsomorphicBaseEvent';

function objectKeys<T>(o: T): Array<keyof T> {
  return <any>Object.keys(o);
}

function createIsomorphicEventType<
  T1 extends string = never,
  TData1 = never,
  T2 extends string = never,
  TData2 = never,
  T3 extends string = never,
  TData3 = never,
  T4 extends string = never,
  TData4 = never,
  T5 extends string = never,
  TData5 = never,
  T6 extends string = never,
  TData6 = never
>(typeOptions: IEventOptionsMap<T1 | T2 | T3 | T4 | T5 | T6>) {
  type TTypesTuple = [T1, T2, T3, T4, T5, T6];
  type EventTypes = T1 | T2 | T3 | T4 | T5 | T6;
  type TDataTuple = [TData1, TData2, TData3, TData4, TData5, TData6];

  class IsomorphicEventType<TType extends EventTypes> extends IsomorphicBaseEvent<
    TTypesTuple,
    TDataTuple,
    TType
  > {
    public static types: TypeMap<EventTypes> = objectKeys(typeOptions).reduce<TypeMap<EventTypes>>(
      (result: any, t) => ({ ...result, t }),
      {} as any,
    );

    constructor(type: TType, data: DataForIsomorphicEvent<TType, TTypesTuple, TDataTuple>) {
      super(type, data, typeOptions);
    }
  }

  return IsomorphicEventType;
}

export default createIsomorphicEventType;
