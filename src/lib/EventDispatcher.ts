import Disposable from 'seng-disposable';
import IEventDispatcher from "./IEventDispatcher";
import IEvent from "./IEvent";
import EventListenerData from "./EventListenerData";
import EventPhase from "./EventPhase";
import CallListenerResult from "./CallListenerResult";

/**
 * Base class that adds the ability to dispatch and listen for events.
 */
export default class EventDispatcher extends Disposable implements IEventDispatcher
{
	public parent:EventDispatcher;
	private _listeners:EventListenerMap = {};
	private _target:IEventDispatcher;

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
	constructor(parent:EventDispatcher = null, target?:IEventDispatcher)
	{
		super();

		this._target = target || this;
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
	 * @param event The event to dispatch
	 * @returns If one of the handlers that have been called during this dispatch
	 * called [[IEvent.preventDefault|event.preventDefault()]], this method will return _false_.
	 * If no handlers have been called or none of the handlers have called
	 * [[IEvent.preventDefault|event.preventDefault()]], this method will return _true_.
	 *
	 * _Please note: [[IEvent.preventDefault|preventDefault()]] can only be called on
	 * events that have their [[IEvent.cancelable|cancelable]] property set to true_
	 */
	public dispatchEvent(event:IEvent):boolean
	{
		if(this.isDisposed())
		{
			// todo: _log.error("Can't dispatchEvent on a disposed EventDispatcher");
		}
		else
		{
			// todo: on debug builds, check willTrigger and log if false

			const callTree = getCallTree(this, event.bubbles);
			event.target = this._target;
			event.eventPhase = callTree.length === 1 ? EventPhase.AT_TARGET : EventPhase.CAPTURING_PHASE;

			for(let i = 0; i < callTree.length; i++)
			{
				const currentTarget = callTree[i];
				event.currentTarget = currentTarget;
				if(currentTarget === this)
				{
					event.eventPhase = EventPhase.AT_TARGET;
				}

				const propagationIsStopped = callListeners(currentTarget._listeners, event);
				if(propagationIsStopped)
				{
					event.eventPhase = EventPhase.NONE;
					break;
				}

				if(i === callTree.length - 1)
				{
					// after last target in tree, reset eventPhase to NONE
					event.eventPhase = EventPhase.NONE;
				}
				else if(currentTarget === this)
				{
					// after target === currentTarget we will enter the bubbling phase
					event.eventPhase = EventPhase.BUBBLING_PHASE;
				}
			}
			event.currentTarget = null;
			return !event.defaultPrevented;
		}
		return true;
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
	public addEventListener(eventType:string, handler:EventHandler, useCapture:boolean = false, priority:number = 0):EventListenerData
	{
		if(typeof(this._listeners[eventType]) === 'undefined')
		{
			this._listeners[eventType] = [];
		}

		// todo: log in debug mode
		const isDebugMode = false;
		if(isDebugMode && this.hasEventListener(eventType, handler, useCapture))
		{
			// log.warn(trying to add double listener)
		}
		// end todo

		const data:EventListenerData = new EventListenerData(this, eventType, handler, useCapture, priority);
		this._listeners[eventType].push(data);
		this._listeners[eventType].sort(this._listenerSorter);

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
	public hasEventListener(eventType:string, handler?:EventHandler, useCapture?:boolean):boolean
	{
		if(typeof handler === 'undefined')
		{
			return !!this._listeners[eventType] && this._listeners[eventType].length > 0;
		}
		else if(!this._listeners[eventType])
		{
			return false;
		}
		else
		{
			for(let i = 0; i < this._listeners[eventType].length; i++)
			{
				const listenerData:EventListenerData = this._listeners[eventType][i];
				if(listenerData.handler === handler && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture))
				{
					return true;
				}
			}
			return false;
		}
	}

	public willTrigger(eventType:string):boolean
	{
		return this.hasEventListener(eventType) || (!!this.parent && this.parent.willTrigger(eventType));
	}

	/**
	 * Removes all event listeners that match the given parameters from this EventDispatcher
	 * instance.
	 * @param eventType Only event listeners of that have this _eventType_ are removed
	 * @param handler Only event listeners that have this handler function will be removed
	 * @param useCapture Only event listeners that have been added with the same _useCapture_
	 * parameter will be removed. _Please note: if no useCapture argument is provided, only
	 * event listeners that have useCapture set to false will be removed._
	 */
	public removeEventListener(eventType:string, handler:EventHandler, useCapture:boolean = false):void
	{
		removeListenersFrom(this._listeners, eventType, handler, useCapture);
	}

	public removeAllEventListeners(eventType?:string):void
	{
		removeListenersFrom(this._listeners, eventType);
	}

	public dispose():void
	{
		this.removeAllEventListeners();

		super.dispose();
	}

	private _listenerSorter(e1:EventListenerData, e2:EventListenerData):number
	{
		return e2.priority - e1.priority;
	}
}

export const removeListenersFrom = (listeners:EventListenerMap, eventType?:string, handler?:EventHandler, useCapture?:boolean) =>
{
	for(let i in listeners)
	{
		if(listeners.hasOwnProperty(i))
		{
			const matchesEventType = !eventType || i === eventType;
			if(matchesEventType && listeners.hasOwnProperty(i) && listeners[i] instanceof Array)
			{
				const listenersForType = listeners[i];
				// traverse the array in reverse. this will make sure removal does not affect the loop
				for(let j = listenersForType.length; j; j--)
				{
					let listenerData:EventListenerData = listenersForType[j - 1];
					if((!handler || handler === listenerData.handler) && (typeof useCapture === 'undefined' || !!useCapture == listenerData.useCapture))
					{
						listenersForType.splice(j - 1, 1);
						// mark the listener as removed, because it might still be active in the current event loop
						listenerData.isRemoved = true;
					}
				}
				// If an eventType was provided, this will be the only property where we need to remove listeners
				if(eventType)
				{
					break;
				}
			}
		}
	}
};

export const getCallTree = (target:EventDispatcher, bubbles:boolean):Array<EventDispatcher> =>
{
	const callTree:Array<EventDispatcher> = [];
	const parents:Array<EventDispatcher> = getParents(target);

	for(let i = parents.length; i; i--)
	{
		callTree.push(parents[i - 1]);
	}
	callTree.push(target);
	if(bubbles)
	{
		Array.prototype.push.apply(callTree, parents);
	}
	return callTree;
};

export const getParents = (target:EventDispatcher):Array<EventDispatcher> =>
{
	let currentTarget:EventDispatcher = target;
	const parents:Array<EventDispatcher> = [];
	while(currentTarget.parent)
	{
		currentTarget = currentTarget.parent;
		parents.push(currentTarget);
	}
	return parents;
};

export const callListeners = (listeners:EventListenerMap, event:IEvent):boolean =>
{
	const listenersOfType:Array<EventListenerData> = listeners[event.type] ? [...listeners[event.type]] : [];
	let propagationIsStopped = false;

	for(let i = 0; i < listenersOfType.length; i++)
	{
		const disabledOnPhase = listenersOfType[i].useCapture ? EventPhase.BUBBLING_PHASE : EventPhase.CAPTURING_PHASE;
		if(event.eventPhase !== disabledOnPhase && !listenersOfType[i].isRemoved)
		{
			const callResult:number = event.callListener(listenersOfType[i].handler);

			if(callResult > CallListenerResult.NONE)
			{
				propagationIsStopped = true;
				if(callResult === CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED)
				{
					break;
				}
			}
		}
	}

	return propagationIsStopped;
};

type EventListenerMap = {[type:string]:Array<EventListenerData>};
export type EventHandler = (event?:IEvent) => any;
