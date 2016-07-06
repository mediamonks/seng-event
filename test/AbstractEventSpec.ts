import AbstractEvent from '../src/lib/AbstractEvent';
import {expect} from 'chai';

describe('AbstractEvent', () =>
{
	describe('subclass', () =>
	{
		it('should be ok', () =>
		{
			expect('test').not.to.equal('foo');
		});
	});
});
