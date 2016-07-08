import EventDispatcher from "../src/lib/EventDispatcher";
import EventListenerData from "../src/lib/EventListenerData";
import chai = require('chai');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import BasicEvent from "../src/lib/event/BasicEvent";
const {expect} = chai;
chai.use(sinonChai);

describe('EventListenerData', () =>
{
	describe('#dispose()', () =>
	{
		const A = new EventDispatcher();
		const handler = sinon.spy();
		const eventListenerData:EventListenerData = A.addEventListener('T', handler);
		eventListenerData.dispose();

		it('should remove the event listener from the attached EventDispatcher', () =>
		{
			A.dispatchEvent(new BasicEvent('T'));
			expect(handler).to.not.have.been.called;
		});
	});
});
