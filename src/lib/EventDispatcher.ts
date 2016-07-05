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

	constructor(target?:IEventDispatcher, parent:EventDispatcher = null)
	{
		super();

		this._target = target || this;
		this.parent = parent;
	}

	public dispatchEvent(event:IEvent):boolean
	{
		if (this.isDisposed())
		{
			// todo: _log.error("Can't dispatchEvent on a disposed EventDispatcher");
		}
		else
		{
			// todo: on debug builds, check willTrigger and log if false

			const callTree = getCallTree(this, event.bubbles);
			event.target = this._target;
			event.eventPhase = callTree.length === 1 ? EventPhase.AT_TARGET : EventPhase.CAPTURING_PHASE;

			for (let i = 0; i < callTree.length; i++)
			{
				const currentTarget = callTree[i];
				event.currentTarget = currentTarget;
				if (currentTarget === this)
				{
					event.eventPhase = EventPhase.AT_TARGET;
				}

				const propagationIsStopped = callListeners(currentTarget._listeners, event);
				if (propagationIsStopped)
				{
					event.eventPhase = EventPhase.NONE;
					break;
				}

				if (i === callTree.length - 1)
				{
					// after last target in tree, reset eventPhase to NONE
					event.eventPhase = EventPhase.NONE;
				}
				else if (currentTarget === this)
				{
					// after target === currentTarget we will enter the bubbling phase
					event.eventPhase = EventPhase.BUBBLING_PHASE;
				}
			}
			event.currentTarget = null;
			return event.defaultPrevented;
		}
		return false;
	}

	public addEventListener(type:string, listener:Listener, useCapture:boolean = false, priority:number = 0):EventListenerData
	{
		if (typeof(this._listeners[type]) === 'undefined')
		{
			this._listeners[type] = [];
		}

		// todo: log in debug mode
		const isDebugMode = false;
		if (isDebugMode && this.hasEventListener(type, listener, useCapture))
		{
			// log.warn(trying to add double listener)
		}
		// end todo

		const data:EventListenerData = new EventListenerData(this, type, listener, useCapture, priority);
		this._listeners[type].push(data);
		this._listeners[type].sort(this._listenerSorter);

		return data;
	}

	public hasEventListener(type:string, listener?:Listener, useCapture?:boolean):boolean
	{
		if (typeof listener === 'undefined')
		{
			return this._listeners[type] && this._listeners[type].length > 0;
		}
		else if (!this._listeners[type])
		{
			return false;
		}
		else
		{
			for (let i = 0; i < this._listeners[type].length; i++)
			{
				const listenerData:EventListenerData = this._listeners[type][i];
				if (listenerData.listener === listener && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture))
				{
					return true;
				}
			}
			return false;
		}
	}

	public willTrigger(type:string):boolean
	{
		return this.hasEventListener(type) || (this.parent && this.parent.willTrigger(type));
	}

	public removeEventListener(type:string, listener:Listener, useCapture:boolean = false):void
	{
		if ((type in this._listeners) && (this._listeners[type] instanceof Array))
		{
			for (let i = this._listeners[type].length; i; i--)
			{
				let listenerData:EventListenerData = this._listeners[type][i - 1];
				if (listenerData.listener === listener && listenerData.useCapture === useCapture)
				{
					this._listeners[type].splice(i - 1, 1);
				}
			}
		}
		else
		{
			// todo: _log.warn('trying to remove event that has no listeners "' + type + '"');
		}
	}

	public removeAllEventListeners(type?:string):void
	{
		if (type === void 0)
		{
			this._listeners = {};
		}
		else if ((type in this._listeners) && (this._listeners[type] instanceof Array))
		{
			this._listeners[type].length = 0;
		}
		else
		{
			// todo: _log.warn('trying to remove all events that does not exist "' + type + '"');
		}
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

export const getCallTree = (target:EventDispatcher, bubbles:boolean):Array<EventDispatcher> =>
{
	const callTree:Array<EventDispatcher> = [];
	const parents:Array<EventDispatcher> = getParents(target);

	for (let i = parents.length; i; i--)
	{
		callTree.push(parents[i - 1]);
	}
	callTree.push(target);
	if (bubbles)
	{
		Array.prototype.push.apply(callTree, parents);
	}
	return callTree;
};

export const getParents = (target:EventDispatcher):Array<EventDispatcher> =>
{
	let currentTarget:EventDispatcher = target;
	const parents:Array<EventDispatcher> = [];
	while (currentTarget.parent)
	{
		currentTarget = currentTarget.parent;
		parents.push(currentTarget);
	}
	return parents;
};

export const callListeners = (listeners:EventListenerMap, event:IEvent):boolean =>
{
	const listenersOfType:Array<EventListenerData> = listeners[event.type] || [];
	let propagationIsStopped = false;

	for (let i = 0; i < listenersOfType.length; i++)
	{
		const disabledOnPhase = listenersOfType[i].useCapture ? EventPhase.BUBBLING_PHASE : EventPhase.CAPTURING_PHASE;
		if (event.eventPhase !== disabledOnPhase)
		{
			const callResult:number = event.callListener(listenersOfType[i].listener);

			if (callResult > CallListenerResult.NONE)
			{
				propagationIsStopped = true;
				if (callResult === CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED)
				{
					break;
				}
			}
		}
	}

	return propagationIsStopped;
};

type EventListenerMap = {[type:string]:Array<EventListenerData>};
export type Listener = (event?:IEvent) => any;
