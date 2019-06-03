import BaseEvent from './BaseEvent';

/**
 * @ignore
 */
export type TypeMap<TType extends string> = { [P in TType]: P };

/**
 * @ignore
 */
export interface EventTypeClass<TData, TType extends string> {
  types: TypeMap<TType>;
  new (type: TType, data: TData): BaseEvent<TData, TType>;
}
