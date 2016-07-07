import Disposable from "seng-disposable";
import EventDispatcher, {Listener} from "./EventDispatcher";

export default class EventListenerData extends Disposable
{
	public isRemoved:boolean = false;

	constructor(public dispatcher:EventDispatcher,
	            public type:string,
	            public listener:Listener,
	            public useCapture:boolean,
	            public priority:number)
	{
		super();
	}

	public dispose():void
	{
		if (this.dispatcher)
		{
			this.dispatcher.removeEventListener(this.type, this.listener, this.useCapture);
			this.dispatcher = null;
		}
		super.dispose();
	}
}
