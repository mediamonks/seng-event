import BaseEvent from './BaseEvent';

interface IEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  setTimeStamp?: boolean;
}

type TypeMap<TType extends string> = { [P in TType]: P };

type IEventOptionsMap<TTypes extends string> = {
  [P in TTypes]: IEventOptions;
};

function objectKeys<T>(o:T):Array<keyof T> {
  return <any> Object.keys(o);
}

function createIsomporphicEventType<
  T1 extends string | void = void,
  TData1 = void,
  T2 extends string | void = void,
  TData2 = void,
  T3 extends string | void = void,
  TData3 = void,
  T4 extends string | void = void,
  TData4 = void,
  T5 extends string | void = void,
  TData5 = void,
  T6 extends string | void = void,
  TData6 = void
>(typeOptions:IEventOptionsMap<Extract<T1|T2|T3|T4|T5|T6, string>>) {
  type EventTypes = Extract<T1|T2|T3|T4|T5|T6, string>;
  type DataFor<T> =
    T extends T1 ? TData1 :
    T extends T2 ? TData2 :
    T extends T3 ? TData3 :
    T extends T4 ? TData4 :
    T extends T5 ? TData5 :
    T extends T6 ? TData6 : void;

  class IsomorphicBaseEvent<TType extends EventTypes> extends BaseEvent<DataFor<TType>, TType> {
    public static types:TypeMap<EventTypes> = objectKeys(typeOptions)
      .reduce<TypeMap<EventTypes>>((result:any, t) => ({ ...result, t }), {} as any);
    public type:TType;
    public data:DataFor<TType>;

    constructor(
      type: TType,
      data: DataFor<TType>
    ) {
      const { bubbles, cancelable, setTimeStamp } = typeOptions[type];
      super(type, data, bubbles, cancelable, setTimeStamp);
    }

    public clone(): IsomorphicBaseEvent<TType> {
      return new IsomorphicBaseEvent(this.type, this.data);
    }
  }

  return IsomorphicBaseEvent;
}

export default createIsomporphicEventType;
