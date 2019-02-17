import SengDisposable from 'seng-disposable';
import EventListenerData from './EventListenerData';
import EventPhase from './EventPhase';
import CallListenerResult from './CallListenerResult';
import AbstractEvent from './AbstractEvent';
import {
  EventHandlerForEvent,
  EventListenerMap,
  TypesForEvent,
  ExtractEventOfType,
} from './EventTypings';

/**
 * Base class that adds the ability to dispatch events and attach handlers that should be
 * called when such events are triggered.
 *
 * This EventDispatcher also supports event capturing and bubbling phases, heavily inspired
 * by existing event dispatching systems like the functionality described in the
 * [DOM Event W3 spec](https://www.w3.org/TR/DOM-Level-2-Events/events.html)
 */
export default class EventDispatcher<
  TEvent extends AbstractEvent = AbstractEvent
> extends SengDisposable {
  /**
   * The parent EventDispatcher instance. If this instance has no parent, this value will be
   * set to _null_. The parent is used in the bubbling and capturing phases of events.
   * @see [[dispatchEvent]] for more information on the bubbling and capturing chain
   */
  public parent: EventDispatcher | null;
  /**
   * An object containing all event listeners by [[IEvent.type|event type]]. Each value
   * on this object is an Array of [[EventListenerData]] objects for each event listener
   * added with that type.
   */
  private listeners: EventListenerMap<TEvent> = {};
  /**
   * The value that will be set as [[IEvent.target|target]] on events that are dispatched
   * by this EventDispatcher instance.
   */
  private target: EventDispatcher;

  /**
   * Creates an EventDispatcher instance.
   * @param parent If set, registers the given EventDispatcher instance as parent. This
   * child-parent relationship is used in the event chain during the capture phase of
   * events and the bubbling phase of bubbling events. For more information on event
   * bubbling and capturing, see [[dispatchEvent]]
   * @param target If set, will set the [[IEvent.target|target]] attribute of all events
   * dispatched by this EventDispatcher to the given object. If not set, will use this instance
   * as a target for dispatched events.
   */
  constructor(parent: EventDispatcher | null = null, target?: EventDispatcher) {
    super();

    this.target = target || this;
    this.parent = parent;
  }

  /**
   * Dispatches the given event. The dispatch consists of three phases:
   * 1. The capture phase. We walk through all ancestors of this EventDispatcher, with the
   * top-most instance first and the direct parent of this EventDispatcher last. On each
   * ancestor, we call all event handlers that are added with the _useCapture_ argument
   * set to _true_ and the _eventType_ set to the same [[IEvent.type|type]] as
   * the given event.
   * If this EventDispatcher has no parent, this phase will be skipped.
   * 2. The target phase. In this phase we call all event handlers on this EventDispatcher
   * instance that listen for the same [[IEvent.type|type]] as the given event.
   * 3. The bubbling phase. This phase will only be executed if the given event has the
   * [[IEvent.bubbles|bubbles]] property set to _true_. If so, we will again walk through
   * all ancestors of this EventDispatcher, but in the reverse order: the direct parent
   * of this instance first and the top-most parent last. On every ancestor, we will call
   * all event handlers that are added with the _useCapture_ argument set to _false_ and the
   * _eventType_ set to the same [[IEvent.type|type]] as the given event.
   *
   * If any of the event handlers call [[IEvent.stopPropagation|stopPropagation()]], we will
   * skip all event handlers that occur on a target later in the event chain. If an event handler
   * calls [[IEvent.stopImmediatePropagation|stopImmediatePropagation()]], we will also skip
   * any event handlers on the same target in the event chain.
   * @param event The event to dispatch
   * @returns If one of the handlers that have been called during this dispatch
   * called [[IEvent.preventDefault|event.preventDefault()]], this method will return _false_.
   * If no handlers have been called or none of the handlers have called
   * [[IEvent.preventDefault|event.preventDefault()]], this method will return _true_.
   *
   * _Please note: [[IEvent.preventDefault|preventDefault()]] can only be called on
   * events that have their [[IEvent.cancelable|cancelable]] property set to true_
   */
  public dispatchEvent(event: TEvent): boolean {
    if (this.isDisposed()) {
      throw new Error("Can't dispatchEvent on a disposed EventDispatcher");
    } else {
      // todo: on debug builds, check willTrigger and log if false
      const callTree = getCallTree(this, event.bubbles);
      event.target = this.target;
      event.eventPhase = callTree.length === 1 ? EventPhase.AT_TARGET : EventPhase.CAPTURING_PHASE;

      for (let i = 0; i < callTree.length; i += 1) {
        const currentTarget = callTree[i];
        event.currentTarget = currentTarget;
        if (currentTarget === this) {
          event.eventPhase = EventPhase.AT_TARGET;
        }
        const propagationIsStopped = callListeners(currentTarget.listeners, event);
        if (propagationIsStopped) {
          event.eventPhase = EventPhase.NONE;
          break;
        }

        if (i === callTree.length - 1) {
          // after last target in tree, reset eventPhase to NONE
          event.eventPhase = EventPhase.NONE;
        } else if (currentTarget === this) {
          // after target === currentTarget we will enter the bubbling phase
          event.eventPhase = EventPhase.BUBBLING_PHASE;
        }
      }
      event.currentTarget = null;
      return !event.defaultPrevented;
    }
  }

  /**
   * Adds a new event listener. The given handler function will be called in the following cases:
   *  - An event with a [[IEvent.type|type]] that is equal to the given _eventType_ is dispatched
   *  on this EventDispatcher instance.
   *  - An event with a [[IEvent.type|type]] that is equal to the given _eventType_ is dispatched
   *  on a child EventDispatcher, and the _useCapture_ parameter is set to _true_
   *  - An event with [[IEvent.bubbles|bubbles]] set to _true_ and a [[IEvent.type|type]] that
   *  is equal to the given _eventType_ is dispatched on a child EventDispatcher, and the
   *  _useCapture_ parameter is set to _false_
   *
   * @see [[dispatchEvent]] for more info on the which event listeners are called during
   * capturing and bubbling
   * @param eventType The eventType to listen for
   * @param handler The handler function that will be called when a matching event is dispatched.
   * This function will retrieve the dispatched [[IEvent|event]] as a parameter
   * @param useCapture Indicates if this handler should be called during the capturing phase
   * of an event chain. If and only if this is set to _false_ will this handler be called
   * during the bubbling phase of an event chain.
   * @param priority A number that indicates the priority of this event listener relative
   * to other event listeners of the same type on this EventDispatcher instance. A higher number
   * indicates that this listener will be called earlier.
   * @returns An object describing the listener that has a [[EventListenerData.dispose|dispose()]]
   * method to remove the listener.
   */
  public addEventListener<TType extends TypesForEvent<TEvent>>(
    eventType: TType,
    handler: EventHandlerForEvent<ExtractEventOfType<TEvent, TType>>,
    useCapture: boolean = false,
    priority: number = 0,
  ) {
    if (typeof this.listeners[eventType] === 'undefined') {
      this.listeners[eventType] = [];
    }

    const data = new EventListenerData<TEvent>(this, eventType, handler, useCapture, priority);
    this.listeners[eventType].push(data);
    this.listeners[eventType].sort(this.listenerSorter);

    return data;
  }

  /**
   * Checks if an event listener matching the given parameters exists on this EventDispatcher
   * instance.
   * @param eventType Will only look for event listeners with this _eventType_
   * @param handler If set, will only match event listeners that have the same handler function
   * @param useCapture If set, will only match event listeners that have the same _useCapture_
   * argument. _Please note: if no useCapture argument was provided to [[addEventListener]], it
   * is set to false by default_
   * @returns {boolean} True if one or more event listeners exist
   */
  public hasEventListener<TType extends TypesForEvent<TEvent>>(
    eventType: TType,
    handler?: EventHandlerForEvent<ExtractEventOfType<TEvent, TType>>,
    useCapture?: boolean,
  ): boolean {
    if (typeof handler === 'undefined') {
      return !!this.listeners[eventType] && this.listeners[eventType].length > 0;
    }
    if (!this.listeners[eventType]) {
      return false;
    }
    for (let i = 0; i < this.listeners[eventType].length; i += 1) {
      const listenerData: EventListenerData = this.listeners[eventType][i];
      if (
        listenerData.handler === handler &&
        (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if an event listener with a [[EventListenerData.type|type]] of the given _eventType_ exists
   * on this EventDispatcher or any ancestor EventDispatcher instance.
   * @param eventType The event type to check for
   * @returns _true_ if a matching listener is found
   */
  public willTrigger(eventType: TypesForEvent<TEvent>): boolean {
    return (
      this.hasEventListener(eventType) || (!!this.parent && this.parent.willTrigger(eventType))
    );
  }

  /**
   * Removes all event listeners that match the given parameters from this EventDispatcher
   * instance.
   *
   * _Please note: if you remove an event listener during the dispatch of an event it will
   * not be called anymore, even if it was supposed to be called in the same event chain_
   * @param eventType Only event listeners of that have this _eventType_ are removed
   * @param handler Only event listeners that have this handler function will be removed
   * @param useCapture Only event listeners that have been added with the same _useCapture_
   * parameter will be removed. _Please note: if no useCapture argument is provided, only
   * event listeners that have useCapture set to false will be removed._
   */
  public removeEventListener<TType extends TypesForEvent<TEvent>>(
    eventType: TType,
    handler: EventHandlerForEvent<TEvent>,
    useCapture: boolean = false,
  ): void {
    removeListenersFrom(this.listeners, eventType, handler, useCapture);
  }

  /**
   * Removes all event listeners that have a [[IEvent.type|type]] of the given _eventType_
   * from this EventDispatcher instance, regardless of their [[EventListenerData.handler|handler]] or
   * [[EventListenerData.useCapture|useCapture]] property.
   *
   * _Please note: if you remove an event listener during the dispatch of an event it will
   * not be called anymore, even if it was supposed to be called in the same event chain_
   * @param eventType The [[IEvent.type|type]] of event to remove. If not provided, all event listeners
   * will be removed regardless of their type.
   */
  public removeAllEventListeners(eventType?: TypesForEvent<TEvent>): void {
    removeListenersFrom(this.listeners, eventType);
  }

  /**
   * Cleans up this EventListener instance. No event handlers on this EventDispatcher will be called
   * and future calls to dispatchEvent() will be ignored.
   */
  public dispose(): void {
    this.removeAllEventListeners();

    super.dispose();
  }

  /**
   * Method that is used to sort arrays of event listeners based on their [[EventListenerData.priority|priority]]
   * property. Higher priority will be sorted before lower priority values.
   * @param e1 The first event listener to compare
   * @param e2 The other event listener to compare to
   * @returns A number that indicates the sorting according to the JS sort() method.
   */
  private listenerSorter(e1: EventListenerData, e2: EventListenerData): number {
    return e2.priority - e1.priority;
  }
}

/**
 * Helper function for [[EventDispatcher.removeEventListener]] and [[EventDispatcher.removeAllEventListeners]].
 * Will remove all event listeners that match the given parameters from the given event listener map object.
 * This function differs from [[EventDispatcher.removeEventListener|removeEventListener()]] in that it does not
 * use default values when you emit one of the parameters. Instead, it will remove event listeners of all
 * possible values for that parameter.
 * @param listeners A map of listeners to remove from. See [[EventDispatcher.listeners]]
 * @param eventType If set, will only remove listeners added with this _eventType_
 * @param handler If set, will only remove listeners with this _handler_
 * @param useCapture If set, will only remove listeners with the same value for _useCapture_
 */
export const removeListenersFrom = <TEvent extends AbstractEvent>(
  listeners: EventListenerMap<TEvent>,
  eventType?: TypesForEvent<TEvent> | null,
  handler?: EventHandlerForEvent<TEvent> | null,
  useCapture?: boolean,
) => {
  for (const i in listeners) {
    /* istanbul ignore else */
    if (listeners.hasOwnProperty(i)) {
      const matchesEventType = !eventType || i === eventType;
      if (matchesEventType && listeners.hasOwnProperty(i) && listeners[i] instanceof Array) {
        const listenersForType = listeners[i];
        // traverse the array in reverse. this will make sure removal does not affect the loop
        for (let j = listenersForType.length; j; j -= 1) {
          const listenerData: EventListenerData = listenersForType[j - 1];
          if (
            (!handler || handler === listenerData.handler) &&
            (typeof useCapture === 'undefined' || !!useCapture === listenerData.useCapture)
          ) {
            listenersForType.splice(j - 1, 1);
            // mark the listener as removed, because it might still be active in the current event loop
            listenerData.isRemoved = true;
          }
        }
        // If an eventType was provided, this will be the only property where we need to remove listeners
        if (eventType) {
          break;
        }
      }
    }
  }
};

/**
 * Gets an array of all parent EventDispatcher instances of the given EventDispatcher. The direct
 * parent (if it has one) will be first in the Array, and the most top-level parent will be last.
 * @param target The instance to get parents for
 * @returns {Array<EventDispatcher>} The array of parents
 */
export const getParents = (target: EventDispatcher): Array<EventDispatcher> => {
  let currentTarget: EventDispatcher = target;
  const parents: Array<EventDispatcher> = [];
  while (currentTarget.parent) {
    currentTarget = currentTarget.parent;
    parents.push(currentTarget);
  }
  return parents;
};

/**
 * Gets an array that represents the entire call tree when an event is dispatched on the given target.
 * See [[EventDispatcher.dispatchEvent]] for more information on the event phases
 * @param target The target to get the call tree for
 * @param bubbles If true, will also include the target instances of the _bubbling_ phase. If false, will
 * only include the _capture_ and target_ phases.
 * @returns An array of EventDispatcher instances in the order that an event will travel during dispatch
 * on the given target.
 */
export const getCallTree = (target: EventDispatcher, bubbles: boolean): Array<EventDispatcher> => {
  const callTree: Array<EventDispatcher> = [];
  const parents: Array<EventDispatcher> = getParents(target);

  for (let i = parents.length; i; i -= 1) {
    callTree.push(parents[i - 1]);
  }
  callTree.push(target);
  if (bubbles) {
    Array.prototype.push.apply(callTree, parents);
  }
  return callTree;
};

/**
 * Calls all listeners on the given event listener map that should be called when the given event is
 * dispatched. If no matching listeners are present, this function has no effect
 * @param listeners The object that contains listeners to call. Has the same format as the
 * [[EventDispatcher.listeners|listeners]] property on [[EventDispatcher]]
 * @param event The event that may trigger listeners in the map
 * @returns True if any of the listeners call [[IEvent.stopPropagation|stopPropagation()]] or
 * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]]. False if no listeners are called or none
 * of them call [[IEvent.stopPropagation|stopPropagation()]] or
 * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]]
 */
export const callListeners = <TEvent extends AbstractEvent>(
  listeners: EventListenerMap<TEvent>,
  event: TEvent,
): boolean => {
  const listenersOfType: Array<EventListenerData<TEvent>> = listeners[event.type]
    ? [...listeners[event.type]]
    : [];
  let propagationIsStopped = false;

  for (let i = 0; i < listenersOfType.length; i += 1) {
    const disabledOnPhase = listenersOfType[i].useCapture
      ? EventPhase.BUBBLING_PHASE
      : EventPhase.CAPTURING_PHASE;
    if (event.eventPhase !== disabledOnPhase && !listenersOfType[i].isRemoved) {
      const callResult: number = event.callListener(listenersOfType[i].handler);

      if (callResult > CallListenerResult.NONE) {
        propagationIsStopped = true;
        if (callResult === CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED) {
          break;
        }
      }
    }
  }

  return propagationIsStopped;
};
