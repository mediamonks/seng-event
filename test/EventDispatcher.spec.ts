import EventDispatcher, {
	getParents,
	getCallTree,
	removeListenersFrom,
	callListeners,
} from '../src/lib/EventDispatcher';
import EventListenerData from '../src/lib/EventListenerData';
import AbstractEvent from "../src/lib/AbstractEvent";

class BasicEvent extends AbstractEvent {
  public clone(): BasicEvent {
    return new BasicEvent(this.type, this.bubbles, this.cancelable, this.timeStamp !== 0);
  }
}

describe('EventDispatcher "A"', () => {
	describe('#dispatchEvent(event)', () => {
		describe('with an event that has eventType=="T" and bubbles==false', () => {
			describe('and an event listener with handler "aHandler()" for eventType "T"', () => {
				it('should call "aHandler() once"', () => {
					const a = new EventDispatcher();
					const aHandler = jest.fn();
					a.addEventListener('T', aHandler);

					const event = new BasicEvent('T', false);
					a.dispatchEvent(event);
					expect(aHandler).toHaveBeenCalledTimes(1);
				});
				describe('that has useCapture==true', () => {
					const a = new EventDispatcher();
					const aHandler = jest.fn();
					a.addEventListener('T', aHandler, true);

					const event = new BasicEvent('T', false);
					a.dispatchEvent(event);
					it('should call "aHandler() once"', () => {
						expect(aHandler).toHaveBeenCalledTimes(1);
					});
				});
				describe(
					'and an event listener "aHandler2() for eventType "T" with priority==2 that removes the "aHandler()" listener',
					() => {
						const a = new EventDispatcher();
						const aHandler = jest.fn();
						a.addEventListener('T', aHandler);
						const aHandler2 = jest.fn(() => {
							a.removeEventListener('T', aHandler);
						});
						a.addEventListener('T', aHandler2, false, 2);

						const event = new BasicEvent('T', false);
						a.dispatchEvent(event);
						it('should not call "aHandler()"', () => {
							expect(aHandler).not.toHaveBeenCalled();
						});
					});
				describe(
					'and an event listener "aHandler2() for eventType "T" with priority==2 that calls a.removeAllEventListeners()',
					() => {
						const a = new EventDispatcher();
						const aHandler = jest.fn();
						a.addEventListener('T', aHandler);
						const aHandler2 = jest.fn(() => {
							a.removeAllEventListeners();
						});
						a.addEventListener('T', aHandler2, false, 2);

						const event = new BasicEvent('T', false);
						a.dispatchEvent(event);
						it('should not call "aHandler()"', () => {
							expect(aHandler).not.toHaveBeenCalled();
						});
					});
				describe('and a parent EventDispatcher "p1"', () => {
					describe('with an event listener with handler "p1Handler()" for eventType "T"', () => {
						describe('that has useCapture==true', () => {
							it('should call "p1Handler()" before "aHandler()"', () => {
							  const callOrder: Array<string> = [];
								const p1 = new EventDispatcher();
								const p1Handler = jest.fn(() => callOrder.push('p1Handler'));
								p1.addEventListener('T', p1Handler, true);

								const a = new EventDispatcher(p1);
								const aHandler = jest.fn(() => callOrder.push('aHandler'));
								a.addEventListener('T', aHandler);

								const event = new BasicEvent('T', false);
								a.dispatchEvent(event);

								expect(callOrder).toEqual(['p1Handler', 'aHandler']);
							});

							describe('where "p1Handler()" calls event.stopImmediatePropagation()', () => {
								const p1 = new EventDispatcher();
								const p1Handler = jest.fn((event: BasicEvent) => event.stopImmediatePropagation());
								p1.addEventListener('T', p1Handler, true);

								const a = new EventDispatcher(p1);
								const aHandler = jest.fn();
								a.addEventListener('T', aHandler);

								const event = new BasicEvent('T', false);
								a.dispatchEvent(event);
								it('should not call aHandler()', () => {
									expect(aHandler).not.toHaveBeenCalled();
								});
							});

							describe('where "p1Handler()" calls event.stopPropagation()', () => {
								const p1 = new EventDispatcher();
								const p1Handler = jest.fn((event: BasicEvent) => event.stopPropagation());
								p1.addEventListener('T', p1Handler, true);

								const a = new EventDispatcher(p1);
								const aHandler = jest.fn();
								a.addEventListener('T', aHandler);

								const event = new BasicEvent('T', false);
								a.dispatchEvent(event);
								it('should not call "aHandler()"', () => {
									expect(aHandler).not.toHaveBeenCalled();
								});
							});

							describe(
								'and another event listener with handler "p1Handler2()" for eventType "T" with useCapture==true, priority==2',
								() => {
									describe('where "p1Handler2()" calls event.stopPropagation() but "p1Handler()" does not', () => {
										const p1 = new EventDispatcher();
										const p1Handler = jest.fn();
										const p1Handler2 = jest.fn((event: BasicEvent) => event.stopPropagation());
										p1.addEventListener('T', p1Handler, true);
										p1.addEventListener('T', p1Handler2, true, 2);

										const a = new EventDispatcher(p1);
										const aHandler = jest.fn();
										a.addEventListener('T', aHandler);

										const event = new BasicEvent('T', false);
										a.dispatchEvent(event);
										it('should call "p1Handler() once"', () => {
											expect(p1Handler).toHaveBeenCalledTimes(1);
										});
										it('should not call "aHandler()"', () => {
											expect(aHandler).not.toHaveBeenCalled();
										});
									});
								});
						});
						describe('that has useCapture==false', () => {
							const p1 = new EventDispatcher();
							const p1Handler = jest.fn();
							p1.addEventListener('T', p1Handler, false);

							const a = new EventDispatcher(p1);
							const aHandler = jest.fn();
							a.addEventListener('T', aHandler);

							const event = new BasicEvent('T', false);
							a.dispatchEvent(event);
							it('should not call "p1Handler()"', () => {
								expect(p1Handler).not.toHaveBeenCalled();
							});
						});
					});
				});


				describe('and another event listener for eventType "T" with handler "aHandler2()" and priority==2', () => {
					describe('where aHandler() calls event.stopImmediatePropagation()', () => {
            const callOrder: Array<string> = [];
						const a = new EventDispatcher();
						const aHandler = jest.fn((event: BasicEvent) => {
						  callOrder.push('aHandler');
						  event.stopImmediatePropagation();
            });
						const aHandler2 = jest.fn(() => {
              callOrder.push('aHandler2');
            });
						a.addEventListener('T', aHandler);
						a.addEventListener('T', aHandler2, false, 2);

						const event = new BasicEvent('T', false);
						a.dispatchEvent(event);
						it('should call "aHandler()" once', () => {
							expect(aHandler).toHaveBeenCalledTimes(1);
						});
						it('should call "aHandler2() once"', () => {
							expect(aHandler2).toHaveBeenCalledTimes(1);
						});
						it('should call "aHandler2()" before "aHandler()"', () => {
							expect(callOrder).toEqual(['aHandler2', 'aHandler']);
						});
					});

					describe('where aHandler2() calls event.stopImmediatePropagation()', () => {
						const a = new EventDispatcher();
						const aHandler = jest.fn();
						const aHandler2 = jest.fn((event: BasicEvent) => event.stopImmediatePropagation());
						a.addEventListener('T', aHandler);
						a.addEventListener('T', aHandler2, false, 2);

						const event = new BasicEvent('T', false);
						a.dispatchEvent(event);
						it('should not "aHandler()"', () => {
							expect(aHandler).not.toHaveBeenCalled();
						});
					});

					describe('where aHandler2() calls event.stopPropagation()', () => {
						const a = new EventDispatcher();
						const aHandler = jest.fn();
						const aHandler2 = jest.fn((event: BasicEvent) => event.stopPropagation());
						a.addEventListener('T', aHandler);
						a.addEventListener('T', aHandler2, false, 2);

						const event = new BasicEvent('T', false);
						a.dispatchEvent(event);
						it('should still call "aHandler()"', () => {
							expect(aHandler).toHaveBeenCalled();
						});
					});
				});

				describe('after the method is called', () => {
					const a = new EventDispatcher();
					const aHandler = () => {
					};
					a.addEventListener('T', aHandler);

					const event = new BasicEvent('T', false);
					a.dispatchEvent(event);

					it('should have set the currentTarget of the event to null', () => {
						expect(event.currentTarget).toBeNull();
					});
					it('should have set the target of the event to EventDispatcher "A"', () => {
						expect(event.target).toEqual(a);
					});
				});
			});

			describe('and an event listener for eventType "Q"', () => {
				const a = new EventDispatcher();
				const handler = jest.fn();
				a.addEventListener('Q', handler);

				const event = new BasicEvent('T', false);
				a.dispatchEvent(event);
				it('should not call the listener', () => {
					expect(handler).not.toHaveBeenCalled();
				});
			});


			describe(
				'and event listeners for eventType "T" with handlers "aHandler()", "bHandler()", "cHandler()" and "dHandler()"' +
				'where "bHandler()" removes the listener with "aHandler()"',
				() => {
				  const callOrder: Array<string> = [];
					const a = new EventDispatcher();
					const aHandler = jest.fn(() => callOrder.push('aHandler'));
					const bHandler = jest.fn(() => {
					  callOrder.push('bHandler');
            a.removeEventListener('T', aHandler);
          });
					const cHandler = jest.fn(() => callOrder.push('cHandler'));
					const dHandler = jest.fn(() => callOrder.push('dHandler'));
					a.addEventListener('T', aHandler);
					a.addEventListener('T', bHandler);
					a.addEventListener('T', cHandler);
					a.addEventListener('T', dHandler);

					const event = new BasicEvent('T', false);
					a.dispatchEvent(event);
					it('should call "aHandler()"', () => {
						expect(aHandler).toHaveBeenCalledTimes(1);
					});
					it('should call "cHandler()"', () => {
						expect(cHandler).toHaveBeenCalledTimes(1);
					});
					it('should call "dHandler()"', () => {
						expect(dHandler).toHaveBeenCalledTimes(1);
					});

					it('should call the handlers in the order ABCD', () => {
						expect(callOrder).toEqual(['aHandler', 'bHandler', 'cHandler', 'dHandler']);
					});
				});
		});
		describe('with an event that has eventType=="T" and bubbles==true', () => {
			describe('and a parent EventDispatcher "p1"', () => {
				describe('that has an event listener with handler "p1Handler()" for eventType "T" with useCapture==false', () => {
					it('should call "p1Handler() once"', () => {
						const p1 = new EventDispatcher();
						const p1Handler = jest.fn();
						p1.addEventListener('T', p1Handler, false);

						const a = new EventDispatcher(p1);

						const event = new BasicEvent('T', true);
						a.dispatchEvent(event);

						expect(p1Handler).toHaveBeenCalledTimes(1);
					});

					describe('and an event listener with handler "p1Handler2()" for eventType "T" with useCapture==true', () => {
						describe('where no handler calls event.preventDefault()', () => {
              const callOrder: Array<string> = [];
							const p1 = new EventDispatcher();
							const p1Handler = jest.fn(() => callOrder.push('p1Handler'));
							p1.addEventListener('T', p1Handler, false);
							const p1Handler2 = jest.fn(() => callOrder.push('p1Handler2'));
							p1.addEventListener('T', p1Handler2, true);

							const a = new EventDispatcher(p1);

							const event = new BasicEvent('T', true, true);
							const result = a.dispatchEvent(event);
							it('should call "p1Handler2()" once', () => {
								expect(p1Handler2).toHaveBeenCalledTimes(1);
							});
							it('should call "p1Handler2()" before "p1Handler()"', () => {
								expect(callOrder).toEqual(['p1Handler2', 'p1Handler']);
							});
							it('should return true', () => {
								expect(result).toBe(true);
							});
						});
						describe('where "p1Handler2()" calls event.preventDefault()', () => {
              const callOrder: Array<string> = [];
							const p1 = new EventDispatcher();
							const p1Handler = jest.fn(() => callOrder.push('p1Handler'));
							p1.addEventListener('T', p1Handler, false);
							const p1Handler2 = jest.fn((event: BasicEvent) => {
                callOrder.push('p1Handler2');
                event.preventDefault();
              });
							p1.addEventListener('T', p1Handler2, true);

							const a = new EventDispatcher(p1);

							const event = new BasicEvent('T', true, true);
							const result = a.dispatchEvent(event);
							it('should call "p1Handler2()" once', () => {
								expect(p1Handler2).toHaveBeenCalledTimes(1);
							});
							it('should call "p1Handler2()" before "p1Handler()"', () => {
                expect(callOrder).toEqual(['p1Handler2', 'p1Handler']);
							});
							it('should return false', () => {
								expect(result).toBe(false);
							});
						});
					});

					describe('and an EventDispatcher "p2" that is the parent of "p1"', () => {
						describe('that has an event listener with handler "p2Handler()" for eventType "T"', () => {
							describe('with useCapture==false', () => {
								it('should call "p1Handler()" before "p2Handler()"', () => {
                  const callOrder: Array<string> = [];
									const p2 = new EventDispatcher();
									const p2Handler = jest.fn(() => callOrder.push('p2Handler'));
									p2.addEventListener('T', p2Handler, false);

									const p1 = new EventDispatcher(p2);
									const p1Handler = jest.fn(() => callOrder.push('p1Handler'));
									p1.addEventListener('T', p1Handler, false);

									const a = new EventDispatcher(p1);

									const event = new BasicEvent('T', true);
									a.dispatchEvent(event);

									expect(callOrder).toEqual(['p1Handler', 'p2Handler']);
								});

								describe('where p1Handler() calls stopPropagation()', () => {
									const p2 = new EventDispatcher();
									const p2Handler = jest.fn();
									p2.addEventListener('T', p2Handler, false);

									const p1 = new EventDispatcher(p2);
									const p1Handler = jest.fn((event: BasicEvent) => event.stopPropagation());
									p1.addEventListener('T', p1Handler, false);

									const a = new EventDispatcher(p1);

									const event = new BasicEvent('T', true);
									a.dispatchEvent(event);
									it('should not call "p2Handler()"', () => {
										expect(p2Handler).not.toHaveBeenCalled();
									});
								});
							});
							describe('with useCapture==true', () => {
                const callOrder: Array<string> = [];
								const p2 = new EventDispatcher();
                const p2Handler = jest.fn(() => callOrder.push('p2Handler'));
								p2.addEventListener('T', p2Handler, true);

								const p1 = new EventDispatcher(p2);
                const p1Handler = jest.fn(() => callOrder.push('p1Handler'));
								p1.addEventListener('T', p1Handler, false);

								const a = new EventDispatcher(p1);

								const event = new BasicEvent('T', true);
								a.dispatchEvent(event);
								it('should call "p2Handler()" before "p1Handler()"', () => {
                  expect(callOrder).toEqual(['p2Handler', 'p1Handler']);
								});
							});
						});

						describe('and an EventDispatcher "p3" that is the parent of "p2"', () => {
							describe(
								'that has event listeners for eventType "T" with handlers "p3Handler1()" and ' +
								'"p3Handler2()" with useCapture==true and useCapture==false',
								() => {
									describe('where no handler calls event.preventDefault()', () => {
                    const callOrder: Array<string> = [];
										const p3 = new EventDispatcher();
                    const p3Handler1 = jest.fn(() => callOrder.push('p3Handler1'));
										p3.addEventListener('T', p3Handler1, true);
                    const p3Handler2 = jest.fn(() => callOrder.push('p3Handler2'));
										p3.addEventListener('T', p3Handler2, false);
										const p2 = new EventDispatcher(p3);

										const p1 = new EventDispatcher(p2);
										const p1Handler = jest.fn();
										p1.addEventListener('T', p1Handler, false);

										const a = new EventDispatcher(p1);

										const event = new BasicEvent('T', true, true);
										const result = a.dispatchEvent(event);

										it('should return true', () => {
											expect(result).toBe(true);
										});

										it('should call "p3Handler1()" once', () => {
											expect(p3Handler1).toHaveBeenCalledTimes(1);
										});

										it('should call "p3Handler2()" once', () => {
											expect(p3Handler2).toHaveBeenCalledTimes(1);
										});

										it('should call "p3Handler1()" before "p3Handler2()"', () => {
                      expect(callOrder).toEqual(['p3Handler1', 'p3Handler2']);
										});
									});
									describe('where "p3Handler2()" calls event.preventDefault()', () => {
										const p3 = new EventDispatcher();
										const p3Handler1 = () => {
										};
										p3.addEventListener('T', p3Handler1, true);
										const p3Handler2 = (event: BasicEvent) => event.preventDefault();
										p3.addEventListener('T', p3Handler2, false);
										const p2 = new EventDispatcher(p3);

										const p1 = new EventDispatcher(p2);
										const p1Handler = () => {
										};
										p1.addEventListener('T', p1Handler, false);

										const a = new EventDispatcher(p1);

										const event = new BasicEvent('T', true, true);
										const result = a.dispatchEvent(event);

										it('should return false', () => {
											expect(result).toBe(false);
										});
									});
								});
						});
					});
				});
			});

			describe(
				'and a child EventDispatcher "C" that has an event listener with handler "cHandler()" for eventType "T"',
				() => {
					const a = new EventDispatcher();
					const C = new EventDispatcher(a);
					const cHandler = jest.fn();
					C.addEventListener('T', cHandler);

					const event = new BasicEvent('T', true);
					a.dispatchEvent(event);

					it('should not call "cHandler()"', () => {
						expect(cHandler).not.toHaveBeenCalled();
					});
				});

			describe('and the same event listener with handler "aHandler()" for eventType "T" added 6 times', () => {
				const a = new EventDispatcher();
				const aHandler = jest.fn();
				a.addEventListener('T', aHandler);
				a.addEventListener('T', aHandler);
				a.addEventListener('T', aHandler);
				a.addEventListener('T', aHandler);
				a.addEventListener('T', aHandler);
				a.addEventListener('T', aHandler);

				const event = new BasicEvent('T', true);
				a.dispatchEvent(event);

				it('should call "aHandler()" exactly 6 times', () => {
					expect(aHandler.mock.calls).toHaveLength(6);
				});
			});
		});

    it('should throw when disposed"', () => {
      const a = new EventDispatcher();
      a.dispose();
      const event = new BasicEvent('T', false);

      expect(() => a.dispatchEvent(event)).toThrow('Can\'t dispatchEvent on a disposed EventDispatcher');
    });
	});

	describe('#addEventListener()', () => {
		describe('without useCapture and priority arguments', () => {
			const a = new EventDispatcher();
			const aHandler = () => {
			};
			const listenerData = a.addEventListener('T', aHandler);
			it('should return EventListenerData with useCapture==false', () => {
				expect(listenerData.useCapture).toBe(false);
			});
			it('should return EventListenerData with priority==0', () => {
				expect(listenerData.priority).toEqual(0);
			});
		});

		describe('called on "A" while handling an event with the same eventType', () => {
			describe('during the target phase of the event', () => {
				const a = new EventDispatcher();
				const aHandler2 = jest.fn();
				const aHandler1 = () => {
					a.addEventListener('T', aHandler2, false, 2);
				};
				a.addEventListener('T', aHandler1, false, 1);

				const event = new BasicEvent('T', true);
				a.dispatchEvent(event);
				it('should not call the handler', () => {
					expect(aHandler2).not.toHaveBeenCalled();
				});
			});

			describe('during the capture phase of the event', () => {
				const p2 = new EventDispatcher();
				const p2Handler = () => {
					a.addEventListener('T', aHandler);
				};
				p2.addEventListener('T', p2Handler, true, 1);

				const p1 = new EventDispatcher(p2);

				const a = new EventDispatcher(p1);
				const aHandler = jest.fn();

				const event = new BasicEvent('T', true);
				a.dispatchEvent(event);

				it('should call the handler', () => {
					expect(aHandler).toHaveBeenCalled();
				});
			});
		});

		describe(
			'called on a parent of "A" while handling a bubbling event with the same eventType during the target phase',
			() => {
				describe('with useCapture==false', () => {
					const p1 = new EventDispatcher();
					const a = new EventDispatcher(p1);
					const p1Handler = jest.fn();
					const aHandler = () => {
						p1.addEventListener('T', p1Handler, false);
					};
					a.addEventListener('T', aHandler);

					const event = new BasicEvent('T', true);
					a.dispatchEvent(event);
					it('should call the handler', () => {
						expect(p1Handler).toHaveBeenCalled();
					});
				});
				describe('with useCapture==true', () => {
					const p1 = new EventDispatcher();
					const a = new EventDispatcher(p1);
					const p1Handler = jest.fn();
					const aHandler = () => {
						p1.addEventListener('T', p1Handler, true);
					};
					a.addEventListener('T', aHandler);

					const event = new BasicEvent('T', true);
					a.dispatchEvent(event);
					it('should not call the handler', () => {
						expect(p1Handler).not.toHaveBeenCalled();
					});
				});
			});
	});

	describe('#hasEventListener()', () => {
		describe('when there is a listener that matches the supplied type, handler and useCapture', () => {
			const a = new EventDispatcher();
			const aHandler = () => {
			};
			a.addEventListener('T', aHandler, false, 2);

			it('should return true', () => {
				expect(a.hasEventListener('T', aHandler, false)).toBe(true);
			});
		});
		describe('when there is a listener that has the same type and useCapture but a different handler', () => {
			const a = new EventDispatcher();
			const aHandler = () => {
			};
			const aHandler2 = () => {
			};
			a.addEventListener('T', aHandler, false, 2);

			it('should return false', () => {
				expect(a.hasEventListener('T', aHandler2, false)).toBe(false);
			});
		});
		describe('when there is a listener that has the same type and handler but a different useCapture', () => {
			const a = new EventDispatcher();
			const aHandler = () => {
			};
			a.addEventListener('T', aHandler, true, 2);

			it('should return false', () => {
				expect(a.hasEventListener('T', aHandler, false)).toBe(false);
			});
		});
		describe('when there is a listener that has the same handler and useCapture but a different type', () => {
			const a = new EventDispatcher();
			const aHandler = () => {
			};
			a.addEventListener('T', aHandler, false, 2);

			it('should return false', () => {
				expect(a.hasEventListener('Q', aHandler, false)).toBe(false);
			});
		});
		describe(
			'when there is a listener with the same eventType, handler and useCapture==true and the useCapture argument ' +
			'is omitted',
			() => {
				const a = new EventDispatcher();
				const aHandler = () => {
				};
				a.addEventListener('T', aHandler, true, 2);

				it('should return true', () => {
					expect(a.hasEventListener('T', aHandler)).toBe(true);
				});
			});
		describe(
			'when there is a listener with the same eventType and the useCapture and listener arguments are omitted',
			() => {
				const a = new EventDispatcher();
				const aHandler = () => {
				};
				a.addEventListener('T', aHandler, true, 2);

				it('should return true', () => {
					expect(a.hasEventListener('T')).toBe(true);
				});
			});
	});

	describe('#willTrigger()', () => {
		describe('when there is an event listener of the same type on "A"', () => {
			const a = new EventDispatcher();
			const aHandler = () => {
			};
			a.addEventListener('T', aHandler, false, 2);

			it('should return true', () => {
				expect(a.willTrigger('T')).toBe(true);
			});
		});
		describe('when there is an event listener of the same type on a parent of "A"', () => {
			const p1 = new EventDispatcher();
			const a = new EventDispatcher(p1);
			const p1Handler = () => {
			};
			p1.addEventListener('T', p1Handler);

			it('should return true', () => {
				expect(a.willTrigger('T')).toBe(true);
			});
		});
		describe('when there is an event listener of a different type on a parent of "A"', () => {
			const p1 = new EventDispatcher();
			const a = new EventDispatcher(p1);
			const p1Handler = () => {
			};
			p1.addEventListener('T', p1Handler);

			it('should return false', () => {
				expect(a.willTrigger('Q')).toBe(false);
			});
		});
	});

	describe('#removeEventListener()', () => {
		describe('with arguments that match multiple event listeners', () => {
			const a = new EventDispatcher();
			const aHandler = jest.fn();
			a.addEventListener('T', aHandler);
			a.addEventListener('T', aHandler, false);
			a.addEventListener('T', aHandler, false, 2);

			a.removeEventListener('T', aHandler, false);
			const event = new BasicEvent('T', true);
			a.dispatchEvent(event);
			it('should prevent the event handler from being called on dispatch', () => {
				expect(aHandler).not.toHaveBeenCalled();
			});
		});

		describe('with arguments that match an event listener and useCapture truthy but not strictly true', () => {
			const a = new EventDispatcher();
			const aHandler = jest.fn();
			a.addEventListener('T', aHandler, true);

			a.removeEventListener('T', aHandler, <any> 5);
			const event = new BasicEvent('T', true);
			a.dispatchEvent(event);
			it('should prevent the event handler from being called on dispatch', () => {
				expect(aHandler).not.toHaveBeenCalled();
			});
		});

		describe('with arguments that match and event listener and useCapture falsy but not strictly false', () => {
			const a = new EventDispatcher();
			const aHandler = jest.fn();
			a.addEventListener('T', aHandler, false);

			a.removeEventListener('T', aHandler, null as any);
			const event = new BasicEvent('T', true);
			a.dispatchEvent(event);
			it('should prevent the event handler from being called on dispatch', () => {
				expect(aHandler).not.toHaveBeenCalled();
			});
		});

		describe('when there is a listener with matching type and handler but a different useCapture', () => {
			const a = new EventDispatcher();
			const aHandler = jest.fn();
			a.addEventListener('T', aHandler);

			a.removeEventListener('T', aHandler, true);
			const event = new BasicEvent('T', true);
			a.dispatchEvent(event);
			it('should still call the handler on dispatch', () => {
				expect(aHandler).toHaveBeenCalled();
			});
		});

		describe('when there is a listener with matching handler and useCapture but a different type', () => {
			const a = new EventDispatcher();
			const aHandler = jest.fn();
			a.addEventListener('T', aHandler);

			a.removeEventListener('Q', aHandler, false);
			const event = new BasicEvent('T', true);
			a.dispatchEvent(event);
			it('should still call the handler on dispatch', () => {
				expect(aHandler).toHaveBeenCalled();
			});
		});

		describe('when there is a listener with matching type and useCapture but a different handler', () => {
			const a = new EventDispatcher();
			const aHandler1 = jest.fn();
			const aHandler2 = () => {
			};
			a.addEventListener('T', aHandler1, true);

			a.removeEventListener('T', aHandler2, true);
			const event = new BasicEvent('T', true);
			a.dispatchEvent(event);
			it('should still call the handler on dispatch', () => {
				expect(aHandler1).toHaveBeenCalled();
			});
		});
	});

	describe('#removeAllEventListeners()', () => {
		describe('when no type is passed', () => {
			const p1 = new EventDispatcher();
			const p1Handler = jest.fn();
			p1.addEventListener('T1', p1Handler, true);

			const a = new EventDispatcher(p1);
			const aHandler1 = jest.fn();
			const aHandler2 = jest.fn();
			const aHandler3 = jest.fn();
			a.addEventListener('T1', aHandler1, true);
			a.addEventListener('T1', aHandler1, false);
			a.addEventListener('T2', aHandler1, false);
			a.addEventListener('T2', aHandler2, true);
			a.addEventListener('T3', aHandler3, true);
			a.addEventListener('T3', aHandler3, false);
			a.addEventListener('T3', aHandler1);

			a.removeAllEventListeners();
			const eventT1 = new BasicEvent('T1', true);
			const eventT2 = new BasicEvent('T2', true);
			const eventT3 = new BasicEvent('T3', true);
			a.dispatchEvent(eventT1);
			a.dispatchEvent(eventT2);
			a.dispatchEvent(eventT3);

			it('should remove all event handlers on the same target', () => {
				expect(aHandler1).not.toHaveBeenCalled();
				expect(aHandler2).not.toHaveBeenCalled();
				expect(aHandler3).not.toHaveBeenCalled();
			});

			it('should not prevent event handlers on a parent target from being called', () => {
				expect(p1Handler).toHaveBeenCalled();
			});
		});
		describe('when there are event handlers that match the given eventType and other handlers that don\'t', () => {
			const a = new EventDispatcher();
			const aHandler1 = jest.fn();
			const aHandler2 = jest.fn();
			const aHandler3 = jest.fn();
			const aHandlerQ = jest.fn();
			a.addEventListener('T', aHandler1, true);
			a.addEventListener('T', aHandler2, false);
			a.addEventListener('T', aHandler3);
			a.addEventListener('Q', aHandlerQ);

			a.removeAllEventListeners('T');
			const eventT = new BasicEvent('T', true);
			const eventQ = new BasicEvent('Q', true);
			a.dispatchEvent(eventT);
			a.dispatchEvent(eventQ);

			it('should prevent the matching event handlers from being called', () => {
				expect(aHandler1).not.toHaveBeenCalled();
				expect(aHandler2).not.toHaveBeenCalled();
				expect(aHandler3).not.toHaveBeenCalled();
			});

			it('should not remove the event handlers for different eventTypes', () => {
				expect(aHandlerQ).toHaveBeenCalled();
			});
		});
	});

	describe('#dispose()', () => {
		const a = new EventDispatcher();
		const aHandler = jest.fn();
		a.addEventListener('T', aHandler);
		a.dispose();
		const event = new BasicEvent('T');

		it('should not dispatch events after disposed', () => {
			expect(() => a.dispatchEvent(event)).toThrow();
			expect(aHandler).not.toHaveBeenCalled();
		});
	});
});

describe('getParents()', () => {
	describe('on a EventDispatcher without parents', () => {
		const a = new EventDispatcher();
		const parents = getParents(a);

		it('should return an empty array', () => {
			expect(parents).toBeInstanceOf(Array);
			expect(parents).toHaveLength(0);
		});
	});
	describe('on an EventDispatcher with 3 parents', () => {
		const p3 = new EventDispatcher();
		const p2 = new EventDispatcher(p3);
		const p1 = new EventDispatcher(p2);
		const a = new EventDispatcher(p1);
		const parents = getParents(a);

		it('should return an array of length 3', () => {
			expect(parents).toBeInstanceOf(Array);
			expect(parents).toHaveLength(3);
		});
		it('should return all the parent instances in root-last order', () => {
			expect(parents[2]).toEqual(p3);
			expect(parents[1]).toEqual(p2);
			expect(parents[0]).toEqual(p1);
		});
	});
});

describe('getCallTree()', () => {
	describe('on a EventDispatcher without parents', () => {
		describe('with bubbles==false', () => {
			const a = new EventDispatcher();
			const callTree = getCallTree(a, false);

			it('should return an array with just the EventDispatcher instance', () => {
				expect(callTree).toBeInstanceOf(Array);
				expect(callTree).toHaveLength(1);
				expect(callTree[0]).toEqual(a);
			});
		});
		describe('with bubbles==true', () => {
			const a = new EventDispatcher();
			const callTree = getCallTree(a, true);

			it('should return an array with just the EventDispatcher instance', () => {
				expect(callTree).toBeInstanceOf(Array);
				expect(callTree).toHaveLength(1);
				expect(callTree[0]).toEqual(a);
			});
		});
	});
	describe('on an EventDispatcher with 3 parents', () => {
		describe('with bubbles==false', () => {
			const p3 = new EventDispatcher();
			const p2 = new EventDispatcher(p3);
			const p1 = new EventDispatcher(p2);
			const a = new EventDispatcher(p1);
			const callTree = getCallTree(a, false);

			it('should return an array of length 4', () => {
				expect(callTree).toBeInstanceOf(Array);
				expect(callTree).toHaveLength(4);
			});
			it('should return an array that starts with the parent instances in root-first order', () => {
				expect(callTree[0]).toEqual(p3);
				expect(callTree[1]).toEqual(p2);
				expect(callTree[2]).toEqual(p1);
			});
			it('should return an array that ends with the EventDispatcher target instance', () => {
				expect(callTree[callTree.length - 1]).toEqual(a);
			});
		});
		describe('with bubbles==true', () => {
			const p3 = new EventDispatcher();
			const p2 = new EventDispatcher(p3);
			const p1 = new EventDispatcher(p2);
			const a = new EventDispatcher(p1);
			const callTree = getCallTree(a, true);

			it('should return an array of length 7', () => {
				expect(callTree).toBeInstanceOf(Array);
				expect(callTree).toHaveLength(7);
			});
			it('should return an array that starts with the parent instances in root-first order', () => {
				expect(callTree[0]).toEqual(p3);
				expect(callTree[1]).toEqual(p2);
				expect(callTree[2]).toEqual(p1);
			});
			it('should return an array that has the target instance on index 3', () => {
				expect(callTree[3]).toEqual(a);
			});
			it('should return an array that ends with the parent instances in root-last order', () => {
				expect(callTree[callTree.length - 1]).toEqual(p3);
				expect(callTree[callTree.length - 2]).toEqual(p2);
				expect(callTree[callTree.length - 3]).toEqual(p1);
			});
		});
	});
});

describe('removeListenersFrom()', () => {
	describe('with no arguments other than listeners', () => {
		const a = new EventDispatcher();
		const aHandler1 = jest.fn();
		const aHandler2 = jest.fn();
		const aHandler3 = jest.fn();

		const PListener = new EventListenerData(a, 'P', aHandler1, false, 5);
		const RListener = new EventListenerData(a, 'R', aHandler2, false, 0);
		const QListener = new EventListenerData(a, 'Q', aHandler1, false, 3);
		const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
			P: [
				PListener,
				new EventListenerData(a, 'P', aHandler1, false, 3),
				new EventListenerData(a, 'P', aHandler2, true, 0),
				new EventListenerData(a, 'P', aHandler2, false, 0),
				new EventListenerData(a, 'P', aHandler3, false, 0),
			],
			Q: [
				new EventListenerData(a, 'Q', aHandler1, true, 8),
				QListener,
				new EventListenerData(a, 'Q', aHandler2, true, 0),
			],
			R: [
				RListener,
				new EventListenerData(a, 'R', aHandler3, false, 0),
			],
		};
		removeListenersFrom(eventListeners);
		it('should remove all event listeners', () => {
			expect(eventListeners['P']).toHaveLength(0);
			expect(eventListeners['Q']).toHaveLength(0);
			expect(eventListeners['R']).toHaveLength(0);
		});
		it('should set isRemoved==true on all event listener data', () => {
			expect(PListener.isRemoved).toBe(true);
			expect(QListener.isRemoved).toBe(true);
			expect(RListener.isRemoved).toBe(true);
		});
	});
	describe('with a given eventType', () => {
		describe('and no other arguments', () => {
			const a = new EventDispatcher();
			const aHandler1 = jest.fn();
			const aHandler2 = jest.fn();
			const aHandler3 = jest.fn();

			const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
				P: [
					new EventListenerData(a, 'P', aHandler1, false, 5),
					new EventListenerData(a, 'P', aHandler1, false, 3),
					new EventListenerData(a, 'P', aHandler2, true, 0),
					new EventListenerData(a, 'P', aHandler2, false, 0),
					new EventListenerData(a, 'P', aHandler3, false, 0),
				],
				Q: [
					new EventListenerData(a, 'Q', aHandler1, true, 8),
					new EventListenerData(a, 'Q', aHandler1, false, 3),
					new EventListenerData(a, 'Q', aHandler2, true, 0),
				],
				R: [
					new EventListenerData(a, 'R', aHandler2, false, 0),
					new EventListenerData(a, 'R', aHandler3, false, 0),
				],
			};
			removeListenersFrom(eventListeners, 'Q');
			it('should remove all event listeners of that eventType', () => {
				expect(eventListeners['Q']).toHaveLength(0);
			});
			it('should not remove event listeners of other eventType', () => {
				expect(eventListeners['R']).toHaveLength(2);
				expect(eventListeners['P']).toHaveLength(5);
			});
		});

		describe('and a given handler', () => {
			describe('but no useCapture argument provided', () => {
				const a = new EventDispatcher();
				const aHandler1 = jest.fn();
				const aHandler2 = jest.fn();
				const aHandler3 = jest.fn();

				const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
					P: [
						new EventListenerData(a, 'P', aHandler1, false, 5),
						new EventListenerData(a, 'P', aHandler1, false, 3),
						new EventListenerData(a, 'P', aHandler1, true, 0),
						new EventListenerData(a, 'P', aHandler2, false, 0),
						new EventListenerData(a, 'P', aHandler3, false, 0),
					],
					R: [
						new EventListenerData(a, 'R', aHandler1, false, 0),
						new EventListenerData(a, 'R', aHandler3, false, 0),
					],
				};
				removeListenersFrom(eventListeners, 'P', aHandler1);
				it('should only remove event listeners that match the eventType and handler', () => {
					expect(eventListeners['P']).toHaveLength(2);
				});
			});
			describe('and useCapture set to false', () => {
				const a = new EventDispatcher();
				const aHandler1 = jest.fn();
				const aHandler2 = jest.fn();
				const aHandler3 = jest.fn();

				const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
					P: [
						new EventListenerData(a, 'P', aHandler1, false, 5),
						new EventListenerData(a, 'P', aHandler1, false, 3),
						new EventListenerData(a, 'P', aHandler1, true, 0),
						new EventListenerData(a, 'P', aHandler2, false, 0),
						new EventListenerData(a, 'P', aHandler3, false, 0),
					],
					R: [
						new EventListenerData(a, 'R', aHandler1, false, 0),
						new EventListenerData(a, 'R', aHandler3, false, 0),
					],
				};
				removeListenersFrom(eventListeners, 'P', aHandler1, false);
				it('should only remove event listeners that match the eventType and handler and useCapture==false', () => {
					expect(eventListeners['P']).toHaveLength(3);
				});
			});
		});
	});
	describe('with useCapture==false but handler==null and eventType==null', () => {
		const a = new EventDispatcher();
		const aHandler1 = jest.fn();
		const aHandler2 = jest.fn();
		const aHandler3 = jest.fn();

		const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
			P: [
				new EventListenerData(a, 'P', aHandler1, false, 5),
				new EventListenerData(a, 'P', aHandler1, false, 3),
				new EventListenerData(a, 'P', aHandler2, true, 0),
				new EventListenerData(a, 'P', aHandler2, false, 0),
				new EventListenerData(a, 'P', aHandler3, false, 0),
			],
			Q: [
				new EventListenerData(a, 'Q', aHandler1, true, 8),
				new EventListenerData(a, 'Q', aHandler1, false, 3),
				new EventListenerData(a, 'Q', aHandler2, true, 0),
			],
			R: [
				new EventListenerData(a, 'R', aHandler2, false, 0),
				new EventListenerData(a, 'R', aHandler3, false, 0),
			],
		};
		removeListenersFrom(eventListeners, null, null, false);

		it('should remove all event listeners that have useCapture==false', () => {
			expect(eventListeners['P']).toHaveLength(1);
			expect(eventListeners['Q']).toHaveLength(2);
			expect(eventListeners['R']).toHaveLength(0);
		});
	});
});

describe('callListeners()', () => {
	describe('with listeners that have the same eventType as the provided event', () => {

		describe('none of which call event.stopPropagation() or event.stopImmediatePropagation()', () => {
			const a = new EventDispatcher();
			const pHandler1 = jest.fn();
			const pHandler2 = jest.fn();
			const pHandler3 = jest.fn();
			const qHandler = jest.fn();
			const rHandler = jest.fn();

			const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
				P: [
					new EventListenerData(a, 'P', pHandler1, false, 5),
					new EventListenerData(a, 'P', pHandler1, false, 3),
					new EventListenerData(a, 'P', pHandler2, true, 0),
					new EventListenerData(a, 'P', pHandler2, false, 0),
					new EventListenerData(a, 'P', pHandler3, false, 0),
				],
				Q: [
					new EventListenerData(a, 'Q', qHandler, true, 8),
					new EventListenerData(a, 'Q', qHandler, false, 3),
					new EventListenerData(a, 'Q', qHandler, true, 0),
				],
				R: [
					new EventListenerData(a, 'R', rHandler, false, 0),
					new EventListenerData(a, 'R', rHandler, false, 0),
				],
			};

			const event = new BasicEvent('P');
			const result = callListeners(eventListeners, event);
			it('should call all the handlers of matching listeners', () => {
				expect(pHandler1).toHaveBeenCalledTimes(2);
				expect(pHandler2).toHaveBeenCalledTimes(2);
				expect(pHandler3).toHaveBeenCalled();
			});
			it('should not call handlers of listeners for other eventTypes', () => {
				expect(qHandler).not.toHaveBeenCalled();
				expect(rHandler).not.toHaveBeenCalled();
			});
			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('one of which calls event.stopPropagation()', () => {
			const a = new EventDispatcher();
			const pHandler1 = jest.fn();
			const pHandler2 = jest.fn((event: BasicEvent) => event.stopPropagation());
			const pHandler3 = jest.fn();

			const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
				P: [
					new EventListenerData(a, 'P', pHandler1, false, 5),
					new EventListenerData(a, 'P', pHandler1, false, 3),
					new EventListenerData(a, 'P', pHandler2, true, 0),
					new EventListenerData(a, 'P', pHandler2, false, 0),
					new EventListenerData(a, 'P', pHandler3, false, 0),
				],
			};

			const event = new BasicEvent('P');
			const result = callListeners(eventListeners, event);
			it('should return true', () => {
				expect(result).toBe(true);
			});
			it('should call all the handlers for listeners of that eventType', () => {
				expect(pHandler1).toHaveBeenCalledTimes(2);
				expect(pHandler2).toHaveBeenCalledTimes(2);
				expect(pHandler3).toHaveBeenCalled();
			});
		});

		describe('one of which calls event.stopImmediatePropagation()', () => {
			const a = new EventDispatcher();
			const pHandler1 = jest.fn();
			const pHandler2 = jest.fn((event: BasicEvent) => event.stopImmediatePropagation());
			const pHandler3 = jest.fn();

			const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
				P: [
					new EventListenerData(a, 'P', pHandler1, false, 5),
					new EventListenerData(a, 'P', pHandler1, false, 3),
					new EventListenerData(a, 'P', pHandler2, true, 0),
					new EventListenerData(a, 'P', pHandler2, false, 0),
					new EventListenerData(a, 'P', pHandler3, false, 0),
				],
			};

			const event = new BasicEvent('P');
			const result = callListeners(eventListeners, event);
			it('should return true', () => {
				expect(result).toBe(true);
			});
			it('should call all the handlers of listeners before that listener in the array of that eventType ', () => {
				expect(pHandler1).toHaveBeenCalledTimes(2);
			});
			it('should not call the handlers of listeners after that listener in the array of that eventType ', () => {
				expect(pHandler2).toHaveBeenCalledTimes(1);
				expect(pHandler3).not.toHaveBeenCalled();
			});
		});
	});

	describe('with no listeners that match the provided event', () => {
		const a = new EventDispatcher();
		const pHandler = () => {
		};

		const eventListeners = <{ [name: string]: Array<EventListenerData> }> {
			P: [
				new EventListenerData(a, 'P', pHandler, false, 5),
				new EventListenerData(a, 'P', pHandler, false, 3),
				new EventListenerData(a, 'P', pHandler, true, 0),
				new EventListenerData(a, 'P', pHandler, false, 0),
				new EventListenerData(a, 'P', pHandler, false, 0),
			],
		};

		const event = new BasicEvent('Q');
		const result = callListeners(eventListeners, event);

		it('should return false', () => {
			expect(result).toBe(false);
		});
	});
});
