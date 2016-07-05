import IEventDispatcher from "./IEventDispatcher";
import EventPhase from "./EventPhase";
import {Listener} from "./EventDispatcher";
import CallListenerResult from "./CallListenerResult";

interface IEvent
{
	type:string;

	bubbles:boolean;
	cancelable:boolean;
	defaultPrevented:boolean;

	target:IEventDispatcher;
	currentTarget:IEventDispatcher;
	timeStamp:number;

	eventPhase:EventPhase;

	callListener(listener:Listener):CallListenerResult;
	clone():IEvent;
	stopPropagation():void;
	stopImmediatePropagation():void;
	preventDefault():void;
}

export default IEvent;
