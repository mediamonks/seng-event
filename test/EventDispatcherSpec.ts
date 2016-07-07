import EventDispatcher from '../src/lib/EventDispatcher';
import BasicEvent from "../src/lib/event/BasicEvent";
import chai = require('chai');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import IEvent from "../src/lib/IEvent";
const {expect} = chai;
chai.use(sinonChai);

describe('EventDispatcher "A"', () =>
{
	describe('#dispatchEvent(event)', () =>
	{
		describe('with an event that has eventType=="T" and bubbles==false', () =>
		{
			describe('and an event listener with handler "A_handler()" for eventType "T"', () =>
			{
				it('should call "A_handler() once"', () =>
				{
					const A = new EventDispatcher();
					const A_handler = sinon.spy();
					A.addEventListener('T', A_handler);

					const event = new BasicEvent('T', false);
					A.dispatchEvent(event);
					expect(A_handler).to.have.been.calledOnce;
				});
				describe('that has useCapture==true', () =>
				{
					const A = new EventDispatcher();
					const A_handler = sinon.spy();
					A.addEventListener('T', A_handler, true);

					const event = new BasicEvent('T', false);
					A.dispatchEvent(event);
					it('should call "A_handler() once"', () =>
					{
						expect(A_handler).to.have.been.calledOnce;
					});
				});
				describe('and an event listener "A_handler2() for eventType "T" with priority==2 that removes the "A_handler()" listener', () =>
				{
					const A = new EventDispatcher();
					const A_handler = sinon.spy();
					A.addEventListener('T', A_handler);
					const A_handler2 = sinon.spy(() =>
					{
						A.removeEventListener('T', A_handler);
					});
					A.addEventListener('T', A_handler2, false, 2);

					const event = new BasicEvent('T', false);
					A.dispatchEvent(event);
					it('should not call "A_handler()"', () =>
					{
						expect(A_handler).not.to.have.been.called;
					});
				});
				describe('and an event listener "A_handler2() for eventType "T" with priority==2 that calls A.removeAllEventListeners()', () =>
				{
					const A = new EventDispatcher();
					const A_handler = sinon.spy();
					A.addEventListener('T', A_handler);
					const A_handler2 = sinon.spy(() =>
					{
						A.removeAllEventListeners();
					});
					A.addEventListener('T', A_handler2, false, 2);

					const event = new BasicEvent('T', false);
					A.dispatchEvent(event);
					it('should not call "A_handler()"', () =>
					{
						expect(A_handler).not.to.have.been.called;
					});
				});
				describe('and a parent EventDispatcher "P1"', () =>
				{
					describe('with an event listener with handler "P1_handler()" for eventType "T"', () =>
					{
						describe("that has useCapture==true", () =>
						{
							it('should call "P1_handler()" before "A_handler()"', () =>
							{
								const P1 = new EventDispatcher();
								const P1_handler = sinon.spy();
								P1.addEventListener('T', P1_handler, true);

								const A = new EventDispatcher(P1);
								const A_handler = sinon.spy();
								A.addEventListener('T', A_handler);

								const event = new BasicEvent('T', false);
								A.dispatchEvent(event);

								expect(P1_handler).to.have.been.calledBefore(A_handler);
							});

							describe('where "P1_handler()" calls event.stopImmediatePropagation()', () =>
							{
								const P1 = new EventDispatcher();
								const P1_handler = sinon.spy((event:IEvent) => event.stopImmediatePropagation());
								P1.addEventListener('T', P1_handler, true);

								const A = new EventDispatcher(P1);
								const A_handler = sinon.spy();
								A.addEventListener('T', A_handler);

								const event = new BasicEvent('T', false);
								A.dispatchEvent(event);
								it('should not call A_handler()', () =>
								{
									expect(A_handler).not.to.have.been.called;
								});
							});

							describe('where "P1_handler()" calls event.stopPropagation()', () =>
							{
								const P1 = new EventDispatcher();
								const P1_handler = sinon.spy((event:IEvent) => event.stopPropagation());
								P1.addEventListener('T', P1_handler, true);

								const A = new EventDispatcher(P1);
								const A_handler = sinon.spy();
								A.addEventListener('T', A_handler);

								const event = new BasicEvent('T', false);
								A.dispatchEvent(event);
								it('should not call "A_handler()"', () =>
								{
									expect(A_handler).not.to.have.been.called;
								});
							});

							describe('and another event listener with handler "P1_handler2()" for eventType "T" with useCapture==true, priority==2', () =>
							{
								describe('where "P1_handler2()" calls event.stopPropagation() but "P1_handler()" does not', () =>
								{
									const P1 = new EventDispatcher();
									const P1_handler = sinon.spy();
									const P1_handler2 = sinon.spy((event:IEvent) => event.stopPropagation());
									P1.addEventListener('T', P1_handler, true);
									P1.addEventListener('T', P1_handler2, true, 2);

									const A = new EventDispatcher(P1);
									const A_handler = sinon.spy();
									A.addEventListener('T', A_handler);

									const event = new BasicEvent('T', false);
									A.dispatchEvent(event);
									it('should call "P1_handler() once"', () =>
									{
										expect(P1_handler).to.have.been.calledOnce;
									});
									it('should not call "A_handler()"', () =>
									{
										expect(A_handler).not.to.have.been.called;
									});
								});
							});
						});
						describe("that has useCapture==false", () =>
						{
							const P1 = new EventDispatcher();
							const P1_handler = sinon.spy();
							P1.addEventListener('T', P1_handler, false);

							const A = new EventDispatcher(P1);
							const A_handler = sinon.spy();
							A.addEventListener('T', A_handler);

							const event = new BasicEvent('T', false);
							A.dispatchEvent(event);
							it('should not call "P1_handler()"', () =>
							{
								expect(P1_handler).not.to.have.been.called;
							});
						});
					});
				});


				describe('and another event listener for eventType "T" with handler "A_handler2()" and priority==2', () =>
				{
					describe('where A_handler() calls event.stopImmediatePropagation()', () =>
					{
						const A = new EventDispatcher();
						const A_handler = sinon.spy((event:IEvent) => event.stopImmediatePropagation());
						const A_handler2 = sinon.spy();
						A.addEventListener('T', A_handler);
						A.addEventListener('T', A_handler2, false, 2);

						const event = new BasicEvent('T', false);
						A.dispatchEvent(event);
						it('should call "A_handler()" once', () =>
						{
							expect(A_handler).to.have.been.calledOnce;
						});
						it('should call "A_handler2() once"', () =>
						{
							expect(A_handler2).to.have.been.calledOnce;
						});
						it('should call "A_handler2()" before "A_handler()"', () =>
						{
							expect(A_handler2).to.have.been.calledBefore(A_handler);
						});
					});

					describe('where A_handler2() calls event.stopImmediatePropagation()', () =>
					{
						const A = new EventDispatcher();
						const A_handler = sinon.spy();
						const A_handler2 = sinon.spy((event:IEvent) => event.stopImmediatePropagation());
						A.addEventListener('T', A_handler);
						A.addEventListener('T', A_handler2, false, 2);

						const event = new BasicEvent('T', false);
						A.dispatchEvent(event);
						it('should not "A_handler()"', () =>
						{
							expect(A_handler).not.to.have.been.called;
						});
					});

					describe('where A_handler2() calls event.stopPropagation()', () =>
					{
						const A = new EventDispatcher();
						const A_handler = sinon.spy();
						const A_handler2 = sinon.spy((event:IEvent) => event.stopPropagation());
						A.addEventListener('T', A_handler);
						A.addEventListener('T', A_handler2, false, 2);

						const event = new BasicEvent('T', false);
						A.dispatchEvent(event);
						it('should still call "A_handler()"', () =>
						{
							expect(A_handler).to.have.been.called;
						});
					});
				});

				describe('after the method is called', () =>
				{
					const A = new EventDispatcher();
					const A_handler = () => {};
					A.addEventListener('T', A_handler);

					const event = new BasicEvent('T', false);
					A.dispatchEvent(event);

					it('should have set the currentTarget of the event to null', () =>
					{
						expect(event.currentTarget).to.be.null;
					});
					it('should have set the target of the event to EventDispatcher "A"', () =>
					{
						expect(event.target).to.equal(A);
					});
				});
			});

			describe('and an event listener for eventType "Q"', () =>
			{
				const A = new EventDispatcher();
				const handler = sinon.spy();
				A.addEventListener('Q', handler);

				const event = new BasicEvent('T', false);
				A.dispatchEvent(event);
				it('should not call the listener', () =>
				{
					expect(handler).not.to.have.been.called;
				})
			});


			describe('and event listeners for eventType "T" with handlers "A_handler()", "B_handler()", "C_handler()" and "D_handler()"' +
				'where "B_handler()" removes the listener with "A_handler()"', () =>
			{
				const A = new EventDispatcher();
				const A_handler = sinon.spy();
				const B_handler = sinon.spy(() => A.removeEventListener('T', A_handler));
				const C_handler = sinon.spy();
				const D_handler = sinon.spy();
				A.addEventListener('T', A_handler);
				A.addEventListener('T', B_handler);
				A.addEventListener('T', C_handler);
				A.addEventListener('T', D_handler);

				const event = new BasicEvent('T', false);
				A.dispatchEvent(event);
				it('should call "A_handler()"', () =>
				{
					expect(A_handler).to.have.been.calledOnce;
				});
				it('should call "C_handler()"', () =>
				{
					expect(C_handler).to.have.been.calledOnce;
				});
				it('should call "D_handler()"', () =>
				{
					expect(D_handler).to.have.been.calledOnce;
				});

				it('should call the handlers in the order ABCD', () =>
				{
					expect(A_handler).to.have.been.calledBefore(B_handler);
					expect(B_handler).to.have.been.calledBefore(C_handler);
					expect(C_handler).to.have.been.calledBefore(D_handler);
				});
			});
		});
		describe('with an event that has eventType=="T" and bubbles==true', () =>
		{
			describe('and a parent EventDispatcher "P1"', () =>
			{
				describe('that has an event listener with handler "P1_handler()" for eventType "T" with useCapture==false', () =>
				{
					it('should call "P1_handler() once"', () =>
					{
						const P1 = new EventDispatcher();
						const P1_handler = sinon.spy();
						P1.addEventListener('T', P1_handler, false);

						const A = new EventDispatcher(P1);

						const event = new BasicEvent('T', true);
						A.dispatchEvent(event);

						expect(P1_handler).to.have.been.calledOnce;
					});

					describe('and an event listener with handler "P1_handler2()" for eventType "T" with useCapture==true', () =>
					{
						const P1 = new EventDispatcher();
						const P1_handler = sinon.spy();
						P1.addEventListener('T', P1_handler, false);
						const P1_handler2 = sinon.spy();
						P1.addEventListener('T', P1_handler2, true);

						const A = new EventDispatcher(P1);

						const event = new BasicEvent('T', true);
						A.dispatchEvent(event);
						it('should call "P1_handler2()" once', () =>
						{
							expect(P1_handler2).to.have.been.calledOnce;
						});
						it('should call "P1_handler2()" before "P1_handler()"', () =>
						{
							expect(P1_handler2).to.have.been.calledBefore(P1_handler);
						});
					});

					describe('and an EventDispatcher "P2" that is the parent of "P1"', () =>
					{
						describe('that has an event listener with handler "P2_handler()" for eventType "T"', () =>
						{
							describe("with useCapture==false", () =>
							{
								it('should call "P1_handler()" before "P2_handler()"', () =>
								{
									const P2 = new EventDispatcher();
									const P2_handler = sinon.spy();
									P2.addEventListener('T', P2_handler, false);

									const P1 = new EventDispatcher(P2);
									const P1_handler = sinon.spy();
									P1.addEventListener('T', P1_handler, false);

									const A = new EventDispatcher(P1);

									const event = new BasicEvent('T', true);
									A.dispatchEvent(event);

									expect(P1_handler).to.have.been.calledBefore(P2_handler);
								});

								describe("where P1_handler() calls stopPropagation()", () =>
								{
									const P2 = new EventDispatcher();
									const P2_handler = sinon.spy();
									P2.addEventListener('T', P2_handler, false);

									const P1 = new EventDispatcher(P2);
									const P1_handler = sinon.spy((event:IEvent) => event.stopPropagation());
									P1.addEventListener('T', P1_handler, false);

									const A = new EventDispatcher(P1);

									const event = new BasicEvent('T', true);
									A.dispatchEvent(event);
									it('should not call "P2_handler()"', () =>
									{
										expect(P2_handler).not.to.have.been.called;
									});
								});
							});
							describe("with useCapture==true", () =>
							{
								const P2 = new EventDispatcher();
								const P2_handler = sinon.spy();
								P2.addEventListener('T', P2_handler, true);

								const P1 = new EventDispatcher(P2);
								const P1_handler = sinon.spy();
								P1.addEventListener('T', P1_handler, false);

								const A = new EventDispatcher(P1);

								const event = new BasicEvent('T', true);
								A.dispatchEvent(event);
								it('should call "P2_handler()" before "P1_handler()"', () =>
								{
									expect(P2_handler).to.have.been.calledBefore(P1_handler);
								});
							});
						});

						describe('and an EventDispatcher "P3" that is the parent of "P2"', () =>
						{
							describe('that has event listeners for eventType "T" with handlers "P3_handler1()" and "P3_handler2()" with useCapture==true and useCapture==false', () =>
							{
								const P3 = new EventDispatcher();
								const P3_handler1 = sinon.spy();
								P3.addEventListener('T', P3_handler1, true);
								const P3_handler2 = sinon.spy();
								P3.addEventListener('T', P3_handler2, false);
								const P2 = new EventDispatcher(P3);

								const P1 = new EventDispatcher(P2);
								const P1_handler = sinon.spy();
								P1.addEventListener('T', P1_handler, false);

								const A = new EventDispatcher(P1);

								const event = new BasicEvent('T', true);
								A.dispatchEvent(event);
								it('should call "P3_handler1()" once', () =>
								{
									expect(P3_handler1).to.have.been.calledOnce;
								});

								it('should call "P3_handler2()" once', () =>
								{
									expect(P3_handler2).to.have.been.calledOnce;
								});

								it('should call "P3_handler1()" before "P3_handler2()"', () =>
								{
									expect(P3_handler1).to.have.been.calledBefore(P3_handler2);
								});
							})
						});
					});
				});
			});

			describe('and a child EventDispatcher "C" that has an event listener with handler "C_handler()" for eventType "T"', () =>
			{
				const A = new EventDispatcher();
				const C = new EventDispatcher(A);
				const C_handler = sinon.spy();
				C.addEventListener('T', C_handler);

				const event = new BasicEvent('T', true);
				A.dispatchEvent(event);

				it('should not call "C_handler()"', () =>
				{
					expect(C_handler).not.to.have.been.called;
				});
			});

			describe('and the same event listener with handler "A_handler()" for eventType "T" added 6 times', () =>
			{
				const A = new EventDispatcher();
				const A_handler = sinon.spy();
				A.addEventListener('T', A_handler);
				A.addEventListener('T', A_handler);
				A.addEventListener('T', A_handler);
				A.addEventListener('T', A_handler);
				A.addEventListener('T', A_handler);
				A.addEventListener('T', A_handler);

				const event = new BasicEvent('T', true);
				A.dispatchEvent(event);

				it('should call "A_handler()" exactly 6 times', () =>
				{
					expect(A_handler.callCount).to.equal(6);
				});
			});
		});
	});

	describe("#addEventListener()", () =>
	{
		describe('without useCapture and priority arguments', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			const listenerData = A.addEventListener('T', A_handler);
			it('should return EventListenerData with useCapture==false', () =>
			{
				expect(listenerData.useCapture).to.be.false;
			});
			it('should return EventListenerData with priority==0', () =>
			{
				expect(listenerData.priority).to.equal(0);
			});
		});

		describe('called on "A" while handling an event with the same eventType', () =>
		{
			describe('during the target phase of the event', () =>
			{
				const A = new EventDispatcher();
				const A_handler2 = sinon.spy();
				const A_handler1 = () =>
				{
					A.addEventListener('T', A_handler2, false, 2);
				};
				A.addEventListener('T', A_handler1, false, 1);

				const event = new BasicEvent('T', true);
				A.dispatchEvent(event);
				it('should not call the handler', () =>
				{
					expect(A_handler2).not.to.have.been.called;
				});
			});

			describe('during the capture phase of the event', () =>
			{
				const P2 = new EventDispatcher();
				const P2_handler = () =>
				{
					A.addEventListener('T', A_handler);
				};
				P2.addEventListener('T', P2_handler, true, 1);

				const P1 = new EventDispatcher(P2);

				const A = new EventDispatcher(P1);
				const A_handler = sinon.spy();

				const event = new BasicEvent('T', true);
				A.dispatchEvent(event);

				it('should call the handler', () =>
				{
					expect(A_handler).to.have.been.called;
				});
			});
		});

		describe('called on a parent of "A" while handling a bubbling event with the same eventType during the target phase', () =>
		{
			describe('with useCapture==false', () =>
			{
				const P1 = new EventDispatcher();
				const A = new EventDispatcher(P1);
				const P1_handler = sinon.spy();
				const A_handler = () =>
				{
					P1.addEventListener('T', P1_handler, false);
				};
				A.addEventListener('T', A_handler);

				const event = new BasicEvent('T', true);
				A.dispatchEvent(event);
				it('should call the handler', () =>
				{
					expect(P1_handler).to.have.been.called;
				});
			});
			describe('with useCapture==true', () =>
			{
				const P1 = new EventDispatcher();
				const A = new EventDispatcher(P1);
				const P1_handler = sinon.spy();
				const A_handler = () =>
				{
					P1.addEventListener('T', P1_handler, true);
				};
				A.addEventListener('T', A_handler);

				const event = new BasicEvent('T', true);
				A.dispatchEvent(event);
				it('should not call the handler', () =>
				{
					expect(P1_handler).not.to.have.been.called;
				});
			});
		});
	});

	describe('#hasEventListener()', () =>
	{
		describe('when there is a listener that matches the supplied type, handler and useCapture', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			A.addEventListener('T', A_handler, false, 2);

			it('should return true', () =>
			{
				expect(A.hasEventListener('T', A_handler, false)).to.be.true;
			});
		});
		describe('when there is a listener that has the same type and useCapture but a different handler', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			const A_handler2 = () => {};
			A.addEventListener('T', A_handler, false, 2);

			it('should return false', () =>
			{
				expect(A.hasEventListener('T', A_handler2, false)).to.be.false;
			});
		});
		describe('when there is a listener that has the same type and handler but a different useCapture', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			A.addEventListener('T', A_handler, true, 2);

			it('should return false', () =>
			{
				expect(A.hasEventListener('T', A_handler, false)).to.be.false;
			});
		});
		describe('when there is a listener that has the same handler and useCapture but a different type', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			A.addEventListener('T', A_handler, false, 2);

			it('should return false', () =>
			{
				expect(A.hasEventListener('Q', A_handler, false)).to.be.false;
			});
		});
		describe('when there is a listener with the same eventType, handler and useCapture==true and the useCapture argument is omitted', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			A.addEventListener('T', A_handler, true, 2);

			it('should return true', () =>
			{
				expect(A.hasEventListener('T', A_handler)).to.be.true;
			});
		});
		describe('when there is a listener with the same eventType and the useCapture and listener arguments are omitted', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			A.addEventListener('T', A_handler, true, 2);

			it('should return true', () =>
			{
				expect(A.hasEventListener('T')).to.be.true;
			});
		});
	});

	describe('#willTrigger()', () =>
	{
		describe('when there is an event listener of the same type on "A"', () =>
		{
			const A = new EventDispatcher();
			const A_handler = () => {};
			A.addEventListener('T', A_handler, false, 2);

			it('should return true', () =>
			{
				expect(A.willTrigger('T')).to.be.true;
			});
		});
		describe('when there is an event listener of the same type on a parent of "A"', () =>
		{
			const P1 = new EventDispatcher();
			const A = new EventDispatcher(P1);
			const P1_handler = () => {};
			P1.addEventListener('T', P1_handler);

			it('should return true', () =>
			{
				expect(A.willTrigger('T')).to.be.true;
			});
		});
		describe('when there is an event listener of a different type on a parent of "A"', () =>
		{
			const P1 = new EventDispatcher();
			const A = new EventDispatcher(P1);
			const P1_handler = () => {};
			P1.addEventListener('T', P1_handler);

			it('should return false', () =>
			{
				expect(A.willTrigger('Q')).to.be.false;
			});
		});
	});
});
