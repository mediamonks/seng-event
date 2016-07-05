import AbstractEvent from "../AbstractEvent";
class BasicEvent extends AbstractEvent {
    clone() {
        return new BasicEvent(this.type, this.bubbles, this.cancelable);
    }
}
export default BasicEvent;
