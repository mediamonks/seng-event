import AbstractEvent from '../AbstractEvent';

class BasicEvent extends AbstractEvent {
	public clone(): BasicEvent {
		return new BasicEvent(this.type, this.bubbles, this.cancelable);
	}
}

export default BasicEvent;
