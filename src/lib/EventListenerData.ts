import Disposable from "seng-disposable";
import EventDispatcher, {EventHandler} from "./EventDispatcher";

export default class EventListenerData extends Disposable
{
	public isRemoved:boolean = false;

	constructor(public dispatcher:EventDispatcher,
	            public type:string,
	            public handler:EventHandler,
	            public useCapture:boolean,
	            public priority:number)
	{
		super();
	}

	public dispose():void
	{
		if (this.dispatcher)
		{
			this.dispatcher.removeEventListener(this.type, this.handler, this.useCapture);
			this.dispatcher = null;
		}
		super.dispose();
	}
}
