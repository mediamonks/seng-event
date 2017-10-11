/**
 * An enum for possible event phases that an event can be in
 */
const enum EventPhase {
	/**
	 * Indicates that the event is currently not being dispatched
	 */
	NONE = 0,
	/**
	 * Indicates that the event is in the capturing phase, moving down from the top-most EventDispatcher
	 * instance to the parent of the target EventDispatcher
	 */
	CAPTURING_PHASE = 1,
	/**
	 * Indicates that we are currently calling the event listeners on the event target during dispatch.
	 */
	AT_TARGET = 2,
	/**
	 * Indicates that we are currently moving back up from the parent of the target EventDispatcher to
	 * the top-most EventDispatcher instance.
	 */
	BUBBLING_PHASE = 3,
}


export default EventPhase;
