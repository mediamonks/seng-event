/**
 * @module seng-event/lib/eventHasType
 */
import BaseEvent from './BaseEvent';

/**
 * Checks if the given [[BaseEvent]] has a the given type and if so,
 * asserts to the compiler that it is a [[BaseEvent]] with that specific type
 * as the `type` property.
 * @param event The event to check
 * @param type A string literal `type`
 */
function eventHasType<TType extends string>(
  event: BaseEvent<any, any>,
  type: TType,
): event is BaseEvent<any, TType> {
  return event.type === type;
}

export default eventHasType;
