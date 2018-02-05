import { expect } from 'chai';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from '../../src/lib/util/eventTypeUtils';

describe('eventTypeUtils', () => {
	describe('generateEventTypes()', () => {
		const testObject = {
			a: EVENT_TYPE_PLACEHOLDER,
			b: EVENT_TYPE_PLACEHOLDER,
			c: 'foo',
		};
		const testObject2 = {
			d: 'bar',
			e: EVENT_TYPE_PLACEHOLDER,
		};
		generateEventTypes({ testObject, testObject2 });

		it(
			'should replace all EVENT_TYPE_PLACEHOLDER values in the given object with a standard name based on the keys',
			() => {
				expect(testObject.a).to.equal('testObject/a');
				expect(testObject.b).to.equal('testObject/b');
				expect(testObject2.e).to.equal('testObject2/e');
			},
		);

		it('should not replace any values different than EVENT_TYPE_PLACEHOLDER', () => {
			expect(testObject.c).to.equal('foo');
			expect(testObject2.d).to.equal('bar');
		});
	});
});
