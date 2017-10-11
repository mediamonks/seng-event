import EventDispatcher from '../src/lib/EventDispatcher';
import EventListenerData from '../src/lib/EventListenerData';
import { expect } from 'chai';
import {} from 'mocha';
import { spy } from 'sinon';
import BasicEvent from '../src/lib/event/BasicEvent';

import sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('EventListenerData', () => {
	describe('#dispose()', () => {
		const a = new EventDispatcher();
		const handler = spy();
		const eventListenerData: EventListenerData = a.addEventListener('T', handler);
		eventListenerData.dispose();

		it('should remove the event listener from the attached EventDispatcher', () => {
			a.dispatchEvent(new BasicEvent('T'));
			expect(handler).to.not.have.been.called;
		});
	});
});
