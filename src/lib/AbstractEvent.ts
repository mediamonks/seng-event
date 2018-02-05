import IEvent from './IEvent';
import EventPhase from './EventPhase';
import IEventDispatcher from './IEventDispatcher';
import { EventHandler } from './EventDispatcher';
import CallListenerResult from './CallListenerResult';

let callListenerResult = CallListenerResult.NONE;

/**
 * Abstract base class for all events that can be dispatched through [[EventDispatcher]]. This class
 * should not be instantiated but extended by a specific event class. For an event class with basic
 * functionality that can be instantiated see [[BasicEvent]]
 */
abstract class AbstractEvent implements IEvent {
  public type: string;
  public bubbles: boolean;
  public cancelable: boolean;

  /**
   * Will be updated by [[EventDispatcher]] during the dispatch of an event to the target that
   * listeners are currently being called on. After completion of an event dispatch this value
   * will be reset to _null_.
   */
  public currentTarget: IEventDispatcher = null;
  /**
   * Will be updated by [[EventDispatcher]] when [[EventDispatcher.dispatchEvent|dispatchEvent]] is
   * called with this event. The value will be set to the EventDispatcher instance that dispatched
   * the event.
   */
  public target: IEventDispatcher = null;
  /**
   * The current event phase of this event. During event dispatch, this value will be either
   * [[EventPhase.CAPTURING_PHASE|CAPTURING_PHASE]], [[EventPhase.AT_TARGET|AT_TARGET]] or
   * [[EventPhase.BUBBLING_PHASE|BUBBLING_PHASE]]. If this event is not currently being dispatched this will be
   * set to [[EventPhase.NONE|NONE]].
   */
  public eventPhase: EventPhase = EventPhase.NONE;
  /**
   * Indicates the time this event is dispatched in the number of milliseconds elapsed since
   * _1 January 1970 00:00:00 UTC_. This value will only be set if the setTimestamp parameter in the constructor
   * is set to _true_. Otherwise, this value will be _0_.
   */
  public timeStamp: number;
  /**
   *  _true_ if [[cancelable]] is true and [[preventDefault]] has been called on this event.
   */
  public defaultPrevented: boolean = false;

  /**
   * Creates a new AbstractEvent instance.
   * @param type The type of the event. Event listeners will only be called if their eventType match this type.
   * @param bubbles If true, the event will also go through a bubbling phase. See [[EventDispatcher.dispatchEvent]]
   * for more information on the event phases.
   * @param cancelable Indicates if [[preventDefault]] can be called on this event. This will prevent the 'default
   * action' of the event from being executed. It is up to the [[EventDispatcher]] instance that dispatches the
   * event to stop the default action from executing when the [[EventDispatcher.dispatchEvent|dispatchEvent]]
   * method returns _false_
   * @param setTimeStamp If true, will set the [[timeStamp]] property of this event to the current time whenever
   * this event is dispatched.
   */
  constructor(
    type: string,
    bubbles: boolean = false,
    cancelable: boolean = false,
    setTimeStamp: boolean = false,
  ) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.timeStamp = setTimeStamp ? Date.now() : 0;
  }

  /**
   * When called during the dispatch of an event, will prevent any targets further in the event chain
   * from being processed. All listeners on the current target will still be executed.
   * @see [[EventDispatcher.dispatchEvent]]
   */
  public stopPropagation(): void {
    if (callListenerResult < CallListenerResult.PROPAGATION_STOPPED) {
      callListenerResult = CallListenerResult.PROPAGATION_STOPPED;
    }
  }

  /**
   * When called during the dispatch of an event, will prevent any other event listener from being
   * called for this event.
   * @see [[EventDispatcher.dispatchEvent]]
   */
  public stopImmediatePropagation(): void {
    callListenerResult = CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED;
  }

  /**
   * May only be called when the [[cancelable]] property of an event is set to _true_. Indicates to the
   * instance that dispatched the event that the default action for the event should not be executed.
   */
  public preventDefault(): void {
    if (this.cancelable) {
      this.defaultPrevented = true;
    } else {
      throw new Error('Called preventDefault on a non-cancelable event');
    }
  }

  /**
   * Calls the given event handler, and returns an enum value that indicates if [[stopPropagation]] or
   * [[stopImmediatePropagation]] have been called on this event during the execution of that handler.
   * @param handler The event handler to execute
   * @returns An enum value, see [[CallListenerResult]]
   */
  public callListener(handler: EventHandler): CallListenerResult {
    callListenerResult = CallListenerResult.NONE;
    handler.call(null, this);
    return callListenerResult;
  }

  /**
   * Should be implemented by child classes and return a copy of the event
   */
  public abstract clone(): AbstractEvent;
}

export default AbstractEvent;
