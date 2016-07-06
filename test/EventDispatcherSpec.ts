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
		});
	});
});
