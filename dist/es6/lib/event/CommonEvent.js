import { generateEventTypes, EVENT_TYPE_PLACEHOLDER } from "../util/EventTypeUtil";
import AbstractEvent from "../AbstractEvent";
class CommonEvent extends AbstractEvent {
    clone() {
        return new CommonEvent(this.type, this.bubbles, this.cancelable);
    }
}
CommonEvent.COMPLETE = EVENT_TYPE_PLACEHOLDER;
CommonEvent.UPDATE = EVENT_TYPE_PLACEHOLDER;
CommonEvent.INIT = EVENT_TYPE_PLACEHOLDER;
CommonEvent.CHANGE = EVENT_TYPE_PLACEHOLDER;
CommonEvent.OPEN = EVENT_TYPE_PLACEHOLDER;
CommonEvent.CLOSE = EVENT_TYPE_PLACEHOLDER;
CommonEvent.RESIZE = EVENT_TYPE_PLACEHOLDER;
generateEventTypes({ CommonEvent });
export default CommonEvent;
