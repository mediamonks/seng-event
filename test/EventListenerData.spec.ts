import EventDispatcher from '../src/lib/EventDispatcher';
import EventListenerData from '../src/lib/EventListenerData';
import AbstractEvent from "../src/lib/AbstractEvent";

class BasicEvent extends AbstractEvent {
  public clone(): BasicEvent {
    return new BasicEvent(this.type, this.bubbles, this.cancelable, this.timeStamp !== 0);
  }
}

describe('EventListenerData', () => {
	describe('#dispose()', () => {
		it('should remove the event listener from the attached EventDispatcher', () => {
      const a = new EventDispatcher();
      const handler = jest.fn();
      const eventListenerData: EventListenerData = a.addEventListener('T', handler);
      eventListenerData.dispose();

			a.dispatchEvent(new BasicEvent('T'));
			expect(handler).not.toHaveBeenCalled();
		});

    it('should not throw when calling dispose twice', () => {
      const a = new EventDispatcher();
      const handler = jest.fn();
      const eventListenerData: EventListenerData = a.addEventListener('T', handler);
      eventListenerData.dispose();

			expect(() => eventListenerData.dispose()).not.toThrow();
    });
	});
});
