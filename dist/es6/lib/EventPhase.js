/**
 * An enum for possible event phases that an event can be in
 */
var EventPhase;
(function (EventPhase) {
    /**
     * Indicates that the event is currently not being dispatched
     */
    EventPhase[EventPhase["NONE"] = 0] = "NONE";
    /**
     * Indicates that the event is in the capturing phase, moving down from the top-most EventDispatcher
     * instance to the parent of the target EventDispatcher
     */
    EventPhase[EventPhase["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
    /**
     * Indicates that we are currently calling the event listeners on the event target during dispatch.
     */
    EventPhase[EventPhase["AT_TARGET"] = 2] = "AT_TARGET";
    /**
     * Indicates that we are currently moving back up from the parent of the target EventDispatcher to
     * the top-most EventDispatcher instance.
     */
    EventPhase[EventPhase["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
})(EventPhase || (EventPhase = {}));
export default EventPhase;
