/**
 * Enum that is returned by the [[AbstractEvent.callListener]] method
 */
enum CallListenerResult {
  /**
   * Indicates that neither [[IEvent.stopPropagation|stopPropagation]] nor
   * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
   */
  NONE = 0,
  /**
   * Indicates that [[IEvent.stopPropagation|stopPropagation]] has been called, but
   * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] hasn't
   */
  PROPAGATION_STOPPED = 1,
  /**
   * Indicates that [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
   */
  IMMEDIATE_PROPAGATION_STOPPED = 2,
}

export default CallListenerResult;
