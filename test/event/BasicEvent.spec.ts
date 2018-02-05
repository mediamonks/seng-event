import { expect } from 'chai';
import BasicEvent from '../../src/lib/event/BasicEvent';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from '../../src/lib/util/eventTypeUtils';

describe('BasicEvent', () => {
	describe('#clone()', () => {

		it('should return a cloned event', () => {
      const event = new BasicEvent('T', true, true, true);
      const clone = event.clone();

			expect(clone.type).to.equal('T');
			expect(clone.bubbles).to.equal(true);
			expect(clone.cancelable).to.equal(true);
			expect(clone.timeStamp).to.not.equal(0);
		});
	});
});
