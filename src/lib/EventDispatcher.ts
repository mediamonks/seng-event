import Disposable from 'seng-disposable';
import IEventDispatcher from "./IEventDispatcher";
import IEvent from "./IEvent";
import EventListenerData from "./EventListenerData";
import EventPhase from "./EventPhase";
import CallListenerResult from "./CallListenerResult";

export default class EventDispatcher extends Disposable implements IEventDispatcher
{
	public parent:EventDispatcher;
	private _listeners:EventListenerMap = {};
	private _target:IEventDispatcher;

	constructor(parent:EventDispatcher = null, target?:IEventDispatcher)
	{
		super();

		this._target = target || this;
		this.parent = parent;
	}

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
