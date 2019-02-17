import AbstractEvent from '../src/lib/AbstractEvent';
import CallListenerResult from '../src/lib/CallListenerResult';

describe('AbstractEvent', () => {
  describe('#callListener', () => {
    describe('with a listener that calls event.stopPropagation()', () => {
      class TestEvent extends AbstractEvent {
        public clone(): TestEvent {
          return new TestEvent(this.type, this.bubbles, this.cancelable);
        }
      }

      const event = new TestEvent('test');
      const handler = (event: TestEvent) => {
        event.stopPropagation();
      };
      const result = event.callListener(handler);

      it('should return CallListenerResult.PROPAGATION_STOPPED', () => {
        expect(result).toBe(CallListenerResult.PROPAGATION_STOPPED);
      });
    });
    describe('with a listener that calls event.stopImmediatePropagation()', () => {
      class TestEvent extends AbstractEvent {
        public clone(): TestEvent {
          return new TestEvent(this.type, this.bubbles, this.cancelable);
        }
      }

      const event = new TestEvent('test');
      const handler = (event: TestEvent) => {
        event.stopImmediatePropagation();
      };
      const result = event.callListener(handler);

      it('should return CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED', () => {
        expect(result).toBe(CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED);
      });
    });
    describe('with a listener that calls event.stopPropagation() and event.stopImmediatePropagation()', () => {
      class TestEvent extends AbstractEvent {
        public clone(): TestEvent {
          return new TestEvent(this.type, this.bubbles, this.cancelable);
        }
      }

      const event = new TestEvent('test');
      const handler = (event: TestEvent) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
      };
      const result = event.callListener(handler);

      it('should return CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED', () => {
        expect(result).toBe(CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED);
      });
    });
    describe("with a listener that doesn't call event.stopPropagation() or event.stopImmediatePropagation()", () => {
      class TestEvent extends AbstractEvent {
        public clone(): TestEvent {
          return new TestEvent(this.type, this.bubbles, this.cancelable);
        }
      }

      const event = new TestEvent('test');
      const handler = () => {};
      const result = event.callListener(handler);

      it('should return CallListenerResult.NONE', () => {
        expect(result).toBe(CallListenerResult.NONE);
      });
    });
  });

  describe('#preventDefault()', () => {
    describe('on a cancellable event', () => {
      class TestEvent extends AbstractEvent {
        public clone(): TestEvent {
          return new TestEvent(this.type, this.bubbles, this.cancelable);
        }
      }

      const event = new TestEvent('test', false, true);

      it('should set defaultPrevented to true', () => {
        event.preventDefault();
        expect(event.defaultPrevented).toBe(true);
      });
    });
    describe('on a non-cancellable event', () => {
      class TestEvent extends AbstractEvent {
        public clone(): TestEvent {
          return new TestEvent(this.type, this.bubbles, this.cancelable);
        }
      }

      const event = new TestEvent('test', false, false);

      it('should throw an error', () => {
        expect(() => event.preventDefault()).toThrowErrorMatchingInlineSnapshot(
          `"Called preventDefault on a non-cancelable event"`,
        );
      });
    });
  });
});
