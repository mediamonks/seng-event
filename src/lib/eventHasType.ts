import BaseEvent from './BaseEvent';

function eventHasType<TType extends string>(
  event: BaseEvent<any, any>,
  type: TType,
): event is BaseEvent<any, TType> {
  return event.type === type;
}

export default eventHasType;
