/**
 * @module seng-event/lib/BaseEvent
 */
import AbstractEvent from './AbstractEvent';

/**
 * Base class for classes generated by [[createEventClass]]. Thin abstraction of [[AbstractEvent]]
 * that adds an additional typed `data` field to events.
 *
 * @typeparam TDataType The type of the `data` field on this event. If not given, will set the type
 * to `undefined` (no data field)
 * @typeparam TEventType A union type of the possible string literals that are possibilities for the
 * `type` property. If not set, will default to `string` (allows for all strings)
 */
class BaseEvent<TDataType = void, TEventType extends string = string> extends AbstractEvent {
  public type: TEventType;
  public data: TDataType;

  /**
   *
   * @param type The event type
   * @param data The data to attach to the event
   * @param bubbles see [[AbstractEvent]]
   * @param cancelable see [[AbstractEvent]]
   * @param setTimeStamp see [[AbstractEvent]]
   */
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
