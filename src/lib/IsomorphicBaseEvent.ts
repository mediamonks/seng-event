import BaseEvent from './BaseEvent';

export interface IEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  setTimeStamp?: boolean;
}

export type IEventOptionsMap<TTypes extends string> = {
  [P in TTypes]: IEventOptions;
};

export type TypeMap<TType extends string> = { [P in TType]: P };

interface IAnyTypeMap {
  [type: string]: string;
}

export type TupleType<T> = [T, T, T, T, T, T];

export type DataForIsomorphicEvent<
  T extends string,
  TTypes extends TupleType<string>,
  TDataTypes extends TupleType<any>
> =
  T extends TTypes[0] ? TDataTypes[0] :
  T extends TTypes[1] ? TDataTypes[1] :
  T extends TTypes[2] ? TDataTypes[2] :
  T extends TTypes[3] ? TDataTypes[3] :
  T extends TTypes[4] ? TDataTypes[4] :
  T extends TTypes[5] ? TDataTypes[5] : never;

class IsomorphicBaseEvent<
  TTypes extends TupleType<string>,
  TDataTypes extends TupleType<any>,
  TType extends TTypes[number],
> extends BaseEvent<DataForIsomorphicEvent<TType, TTypes, TDataTypes>, TType> {
  public static types:IAnyTypeMap;

  public type:TType;
  public data:DataForIsomorphicEvent<TType, TTypes, TDataTypes>;

  private typeOptions:IEventOptionsMap<TTypes[number]>;

  constructor(
    type: TType,
    data: DataForIsomorphicEvent<TType, TTypes, TDataTypes>,
    typeOptions:IEventOptionsMap<TTypes[number]>
  ) {
    const { bubbles, cancelable, setTimeStamp } = typeOptions[type];
    super(type, data, bubbles, cancelable, setTimeStamp);
    this.typeOptions = typeOptions;
  }

  public clone(): IsomorphicBaseEvent<TTypes, TDataTypes, TType> {
    return new IsomorphicBaseEvent(this.type, this.data, this.typeOptions);
  }
}

export default IsomorphicBaseEvent;
