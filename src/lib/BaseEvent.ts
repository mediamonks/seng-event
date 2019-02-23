/**
 * @module seng-event
 */
import AbstractEvent from './AbstractEvent';

class BaseEvent<TDataType = void, TEventType extends string = string> extends AbstractEvent {
  public type: TEventType;
  public data: TDataType;

  constructor(
    type: TEventType,
    data: TDataType,
    bubbles: boolean = false,
    cancelable: boolean = false,
    setTimeStamp: boolean = false,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);
    this.type = type;
    this.data = data;
  }

  public clone(): BaseEvent<TDataType, TEventType> {
    return new BaseEvent<TDataType, TEventType>(
      this.type,
      this.data,
      this.bubbles,
      this.cancelable,
      !!this.timeStamp,
    );
  }
}

export default BaseEvent;
