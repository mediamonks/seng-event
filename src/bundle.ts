// allows us to specify --noEmitHelpers within our tsconfig.json
// this skips emitting helpers in every file, we just load them once here
import 'ts-helpers';

// Export all classes (named and default) that you want to be publicly available
// in the browser as named exports here.
// Interfaces should be ignored, as they don't export any code.
import { default as _export } from './lib/EventDispatcher';

export { default as IEventDispatcher } from './lib/IEventDispatcher';
export { default as IEvent } from './lib/IEvent';
export { default as EventPhase } from './lib/EventPhase';
export { default as EventListenerData } from './lib/EventListenerData';
export { default as CallListenerResult } from './lib/CallListenerResult';
export { default as AbstractEvent } from './lib/AbstractEvent';
import './lib/event/CommonEvent';
import './lib/event/BasicEvent';
import './lib/util/eventTypeUtils';

export default _export;
