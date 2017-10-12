import { generateEventTypes, EVENT_TYPE_PLACEHOLDER } from '../util/eventTypeUtils';
import AbstractEvent from '../AbstractEvent';

class CommonEvent extends AbstractEvent {
	public static COMPLETE: string = EVENT_TYPE_PLACEHOLDER;
	public static UPDATE: string = EVENT_TYPE_PLACEHOLDER;
	public static INIT: string = EVENT_TYPE_PLACEHOLDER;
	public static CHANGE: string = EVENT_TYPE_PLACEHOLDER;
	public static OPEN: string = EVENT_TYPE_PLACEHOLDER;
	public static CLOSE: string = EVENT_TYPE_PLACEHOLDER;
	public static RESIZE: string = EVENT_TYPE_PLACEHOLDER;

	public clone(): CommonEvent {
		return new CommonEvent(this.type, this.bubbles, this.cancelable);
	}
}

generateEventTypes({ CommonEvent });

export default CommonEvent;
