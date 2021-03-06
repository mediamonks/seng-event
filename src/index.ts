/**
 * @module seng-event
 * @preferred
 *
 * The main seng-event module
 */
import { default as _export } from './lib/EventDispatcher';

export * from './lib/types';
export { default as createEventClass } from './lib/createEventClass';
export { default as createIsomorphicEventClass } from './lib/createIsomorphicEventClass';
export { default as EventPhase } from './lib/EventPhase';
export { default as EventListenerData } from './lib/EventListenerData';
export { default as CallListenerResult } from './lib/CallListenerResult';
export { default as AbstractEvent } from './lib/AbstractEvent';

export default _export;
