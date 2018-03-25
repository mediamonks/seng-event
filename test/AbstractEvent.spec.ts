import AbstractEvent from '../src/lib/AbstractEvent';
import { expect } from 'chai';
import IEvent from '../src/lib/IEvent';
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
			const handler = (event: IEvent) => {
				event.stopPropagation();
			};
			const result = event.callListener(handler);

			it('should return CallListenerResult.PROPAGATION_STOPPED', () => {
				expect(result).to.equal(CallListenerResult.PROPAGATION_STOPPED);
			});
		});
		describe('with a listener that calls event.stopImmediatePropagation()', () => {
			class TestEvent extends AbstractEvent {
				public clone(): TestEvent {
					return new TestEvent(this.type, this.bubbles, this.cancelable);
				}
			}

			const event = new TestEvent('test');
			const handler = (event: IEvent) => {
				event.stopImmediatePropagation();
			};
			const result = event.callListener(handler);

			it('should return CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED', () => {
				expect(result).to.equal(CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED);
			});
		});
		describe('with a listener that calls event.stopPropagation() and event.stopImmediatePropagation()', () => {
			class TestEvent extends AbstractEvent {
				public clone(): TestEvent {
					return new TestEvent(this.type, this.bubbles, this.cancelable);
				}
			}

			const event = new TestEvent('test');
			const handler = (event: IEvent) => {
				event.stopImmediatePropagation();
				event.stopPropagation();
			};
			const result = event.callListener(handler);

			it('should return CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED', () => {
				expect(result).to.equal(CallListenerResult.IMMEDIATE_PROPAGATION_STOPPED);
			});
		});
		describe('with a listener that doesn\'t call event.stopPropagation() or event.stopImmediatePropagation()', () => {
			class TestEvent extends AbstractEvent {
				public clone(): TestEvent {
					return new TestEvent(this.type, this.bubbles, this.cancelable);
				}
			}

			const event = new TestEvent('test');
			const handler = () => {
			};
			const result = event.callListener(handler);

			it('should return CallListenerResult.NONE', () => {
				expect(result).to.equal(CallListenerResult.NONE);
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
				expect(event.defaultPrevented).to.be.true;
			});
		});
		describe('on a non-cancellable event', () => {
			class TestEvent extends AbstractEvent {
				public clone(): TestEvent {
					return new TestEvent(this.type, this.bubbles, this.cancelable);
				}
			}

			const event = new TestEvent('test', false, false);

			it('should throw an erro', () => {
				expect(() => event.preventDefault()).to.throw(Error);
			});
		});
	});

});
