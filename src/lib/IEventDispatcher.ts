import IEvent from "./IEvent";
import EventListenerData from "./EventListenerData";
import {Listener} from "./EventDispatcher";

interface IEventDispatcher
{
	dispatchEvent(event:IEvent):boolean;
	addEventListener(type:string, listener:Listener, useCapture?:boolean, priority?:number):EventListenerData;
	hasEventListener(type:string, listener?:Listener, useCapture?:boolean):boolean;
	willTrigger(type:string):boolean;
	removeEventListener(type:string, listener:Listener, useCapture?:boolean):void;
	removeAllEventListeners(type?:string):void;
	dispose():void;
}

export default IEventDispatcher;
