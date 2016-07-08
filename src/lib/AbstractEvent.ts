import IEvent from "./IEvent";
import EventPhase from "./EventPhase";
import IEventDispatcher from "./IEventDispatcher";
import {EventHandler} from './EventDispatcher';
import CallListenerResult from "./CallListenerResult";

let _callListenerResult = CallListenerResult.NONE;

abstract class AbstractEvent implements IEvent
{
	public currentTarget:IEventDispatcher = null;
	public target:IEventDispatcher = null;
	public eventPhase:EventPhase = EventPhase.NONE;
	public timeStamp:number;

	private _defaultPrevented:boolean = false;

	constructor(public type:string,
	            public bubbles:boolean = false,
	            public cancelable:boolean = false,
	            setTimeStamp:boolean = false)
	{
		this.timeStamp = setTimeStamp ? Date.now() : 0;
	}

	public get defaultPrevented():boolean
	{
		return this._defaultPrevented;
	}

	public stopPropagation():void
	{
		if (_callListenerResult < CallListenerResult.PROPAGATION_STOPPED)
		{
			_callListenerResult = CallListenerResult.PROPAGATION_STOPPED;
		}
	}

	public stopImmediatePropagation():void
	{
		_callListenerResult = CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED;
	}

	public preventDefault():void
	{
		if (this.cancelable)
		{
			this._defaultPrevented = true;
		}
		else
		{
			// todo: log not cancelable
		}
	}

	public callListener(handler:EventHandler):CallListenerResult
	{
		_callListenerResult = CallListenerResult.NONE;
		handler.call(null, this);
		return _callListenerResult;
	}

	public abstract clone():AbstractEvent;
}

export default AbstractEvent;
