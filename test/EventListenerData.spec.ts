import 'mocha';
import { expect, use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import EventDispatcher from '../src/lib/EventDispatcher';
import EventListenerData from '../src/lib/EventListenerData';
import BasicEvent from '../src/lib/event/BasicEvent';

use(sinonChai);

describe('EventListenerData', () => {
	describe('#dispose()', () => {
		it('should remove the event listener from the attached EventDispatcher', () => {
      const a = new EventDispatcher();
      const handler = spy();
      const eventListenerData: EventListenerData = a.addEventListener('T', handler);
      eventListenerData.dispose();

			a.dispatchEvent(new BasicEvent('T'));
			expect(handler).to.not.have.been.called;
		});

    it('should not throw when calling dispose twice', () => {
      const a = new EventDispatcher();
      const handler = spy();
      const eventListenerData: EventListenerData = a.addEventListener('T', handler);
      eventListenerData.dispose();

			expect(() => eventListenerData.dispose()).to.not.throw();
    });
	});
});
