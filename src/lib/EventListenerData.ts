/**
 * @module seng-event
 */
import sengDisposable from 'seng-disposable';
import EventDispatcher from './EventDispatcher';
import AbstractEvent from './AbstractEvent';
import { EventHandlerForEvent, TypesForEvent } from './EventTypings';

/**
 * Data object that is created on every call to [[EventDispatcher.addEventListener]]. The object is
 * saved on the [[EventDispatcher.listeners]] object for internal use but is also returned by the
 * _addEventListener_ method as a way to remove the listener.
 */
export default class EventListenerData<
  TEvent extends AbstractEvent = AbstractEvent
> extends sengDisposable {
  public dispatcher: EventDispatcher<TEvent>;
  public type: TypesForEvent<TEvent>;
  public handler: EventHandlerForEvent<TEvent>;
  public useCapture: boolean;
  public priority: number;
  /**
   * This property will be set to `true` by the [[EventDispatcher]] this listener is bound to when
   * the listener is removed. This is to make sure the handler is not called, even if the listener
   * is removed while dispatching the event.
   */
  public isRemoved: boolean = false;

  /**
   * @param dispatcher The EventDispatcher on which this listener listens for events
   * @param type The type of event this listener responds to
   * @param handler The handler function that will be called when a matching event is dispatched
   * @param useCapture Set to the `useCapture` argument passed to [[EventDispatcher.addEventListener|addEventListener]]
   * @param priority Set to the `priority` argument passed to [[EventDispatcher.addEventListener|addEventListener]].
   * Used to sort the listener within the [[EventDispatcher.listeners|listeners]] object of the EventDispatcher
   */
  constructor(
    dispatcher: EventDispatcher<TEvent>,
    type: TypesForEvent<TEvent>,
    handler: EventHandlerForEvent<any>,
    useCapture: boolean,
    priority: number,
  ) {
    super();
    this.dispatcher = dispatcher;
    this.type = type;
    this.handler = handler;
    this.useCapture = useCapture;
    this.priority = priority;
  }

  /**
   * Detaches this event listener from its EventDispatcher. The handler function on this listener will
   * no longer be called in response to dispatched events.
   */
  public dispose(): void {
    if (this.dispatcher) {
      this.dispatcher.removeEventListener(this.type, this.handler, this.useCapture);
    }
    super.dispose();
  }
}
