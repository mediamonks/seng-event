import BaseEvent from './BaseEvent';
import { DataForIsomorphicEvent } from './EventTypings';

export interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  setTimeStamp?: boolean;
}

export type EventOptionsMap<TTypes extends string> = { [T in TTypes]: EventOptions };

class IsomorphicBaseEvent<
  TTypes extends Array<string>,
  TDataTypes extends Array<any>,
  TType extends TTypes[number]
> extends BaseEvent<DataForIsomorphicEvent<TType, TTypes, TDataTypes>, TType> {
  public type: TType;
  public data: DataForIsomorphicEvent<TType, TTypes, TDataTypes>;

  private typeOptions: EventOptionsMap<TTypes[number]>;

  constructor(
    type: TType,
    data: DataForIsomorphicEvent<TType, TTypes, TDataTypes>,
    typeOptions: EventOptionsMap<TTypes[number]>,
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
