/**
 * Enum that is returned by the [[AbstractEvent.callListener]] method
 */
var CallListenerResult;
(function (CallListenerResult) {
    /**
     * Indicates that neither [[IEvent.stopPropagation|stopPropagation]] nor
     * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
     */
    CallListenerResult[CallListenerResult["NONE"] = 0] = "NONE";
    /**
     * Indicates that [[IEvent.stopPropagation|stopPropagation]] has been called, but
     * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] hasn't
     */
    CallListenerResult[CallListenerResult["PROPAGATION_STOPPED"] = 1] = "PROPAGATION_STOPPED";
    /**
     * Indicates that [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
     */
    CallListenerResult[CallListenerResult["IMMEDIATE_PROPAGATION_STOPPED"] = 2] = "IMMEDIATE_PROPAGATION_STOPPED";
})(CallListenerResult || (CallListenerResult = {}));
export default CallListenerResult;
