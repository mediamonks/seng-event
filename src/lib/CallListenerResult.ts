/**
 * @module seng-event
 */

/**
 * Enum that is returned by the [[AbstractEvent.callListener]] method
 */
enum CallListenerResult {
  /**
   * Indicates that neither [[AbstractEvent.stopPropagation|stopPropagation]] nor
   * [[AbstractEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
   */
  NONE = 0,
  /**
   * Indicates that [[AbstractEvent.stopPropagation|stopPropagation]] has been called, but
   * [[AbstractEvent.stopImmediatePropagation|stopImmediatePropagation]] hasn't
   */
  PROPAGATION_STOPPED = 1,
  /**
   * Indicates that [[AbstractEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
   */
  IMMEDIATE_PROPAGATION_STOPPED = 2,
}

export default CallListenerResult;
