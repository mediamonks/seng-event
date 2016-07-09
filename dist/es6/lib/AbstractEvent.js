let _callListenerResult = 0 /* NONE */;
/**
 * Abstract base class for all events that can be dispatched through [[EventDispatcher]]. This class
 * should not be instantiated but extended by a specific event class. For an event class with basic
 * functionality that can be instantiated see [[BasicEvent]]
 */
class AbstractEvent {
    /**
     * Creates a new AbstractEvent instance.
     * @param type The type of the event. Event listeners will only be called if their eventType match this type.
     * @param bubbles If true, the event will also go through a bubbling phase. See [[EventDispatcher.dispatchEvent]]
     * for more information on the event phases.
     * @param cancelable Indicates if [[preventDefault]] can be called on this event. This will prevent the 'default
     * action' of the event from being executed. It is up to the [[EventDispatcher]] instance that dispatches the
     * event to stop the default action from executing when the [[EventDispatcher.dispatchEvent|dispatchEvent]]
     * method returns _false_
     * @param setTimeStamp If true, will set the [[timeStamp]] property of this event to the current time whenever
     * this event is dispatched.
     */
    constructor(type, bubbles = false, cancelable = false, setTimeStamp = false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        /**
         * Will be updated by [[EventDispatcher]] during the dispatch of an event to the target that
         * listeners are currently being called on. After completion of an event dispatch this value
         * will be reset to _null_.
         */
        this.currentTarget = null;
        /**
         * Will be updated by [[EventDispatcher]] when [[EventDispatcher.dispatchEvent|dispatchEvent]] is
         * called with this event. The value will be set to the EventDispatcher instance that dispatched
         * the event.
         */
        this.target = null;
        /**
         * The current event phase of this event. During event dispatch, this value will be either [[EventPhase.CAPTURING_PHASE|CAPTURING_PHASE]],
         * [[EventPhase.AT_TARGET|AT_TARGET]] or [[EventPhase.BUBBLING_PHASE|BUBBLING_PHASE]]. If this event is not currently
         * being dispatched this will be set to [[EventPhase.NONE|NONE]].
         */
        this.eventPhase = 0 /* NONE */;
        /**
         *  _true_ if [[cancelable]] is true and [[preventDefault]] has been called on this event.
         */
        this._defaultPrevented = false;
        this.timeStamp = setTimeStamp ? Date.now() : 0;
    }
    /**
     * _true_ if [[cancelable]] is true and [[preventDefault]] has been called on this event.
     */
    get defaultPrevented() {
        return this._defaultPrevented;
    }
    /**
     * When called during the dispatch of an event, will prevent any targets further in the event chain
     * from being processed. All listeners on the current target will still be executed.
     * @see [[EventDispatcher.dispatchEvent]]
     */
    stopPropagation() {
        if (_callListenerResult < 1 /* PROPAGATION_STOPPED */) {
            _callListenerResult = 1 /* PROPAGATION_STOPPED */;
        }
    }
    /**
     * When called during the dispatch of an event, will prevent any other event listener from being
     * called for this event.
     * @see [[EventDispatcher.dispatchEvent]]
     */
    stopImmediatePropagation() {
        _callListenerResult = 2 /* IMMEDIATE_PROPAGATION_STOPPED */;
    }
    /**
     * May only be called when the [[cancelable]] property of an event is set to _true_. Indicates to the
     * instance that dispatched the event that the default action for the event should not be executed.
     */
    preventDefault() {
        if (this.cancelable) {
            this._defaultPrevented = true;
        }
        else {
            throw new Error('Called preventDefault on a non-cancelable event');
        }
    }
    /**
     * Calls the given event handler, and returns an enum value that indicates if [[stopPropagation]] or
     * [[stopImmediatePropagation]] have been called on this event during the execution of that handler.
     * @param handler The event handler to execute
     * @returns An enum value, see [[CallListenerResult]]
     */
    callListener(handler) {
        _callListenerResult = 0 /* NONE */;
        handler.call(null, this);
        return _callListenerResult;
    }
}
export default AbstractEvent;
