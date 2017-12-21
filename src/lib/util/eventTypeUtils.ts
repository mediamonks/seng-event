/**
 * Constant string that can be used as a placeholder for the static event types on an
 * [[IEvent]] class. See [[generateEventTypes]] for usage.
 */
export const EVENT_TYPE_PLACEHOLDER: string = '__eventTypeUtil::EVENT_TYPE_PLACEHOLDER';

/**
 * It is common practice to have static properties on an [[AbstractEvent|event class]] that indicate
 * which event types should be used with that class. For example:
 * ```typescript
 * // FooEvent.ts
 * class FooEvent extends AbstractEvent {
 *    ...
 *    public static COMPLETE:string = 'complete';
 *    ...
 * }
 * // BarEvent.ts
 * class BarEvent extends AbstractEvent {
 *    ...
 *    public static COMPLETE:string = 'complete';
 *    ...
 * }
 * ```
 * One problem with this example is that all event handlers added using [[EventDispatcher.addEventListener]] for
 * _FooEvent.COMPLETE_ will also be called when the unrelated _BarEvent.COMPLETE_ is dispatched.
 * To prevent this it is best practice to prefix the event type with the event class, like so:
 * ```typescript
 * // FooEvent.ts
 * class FooEvent extends AbstractEvent {
 *    ...
 *    public static COMPLETE:string = 'FooEvent/COMPLETE';
 *    ...
 * }
 * // BarEvent.ts
 * class BarEvent extends AbstractEvent {
 *    ...
 *    public static COMPLETE:string = 'BarEvent/COMPLETE';
 *    ...
 * }
 * ```
 * This utility provides a way to generate these event types, making sure that the event types stay consistent
 * throughout your application and that no string is mistyped by accident. Using this utility, our example now
 * looks like this:
 * ```typescript
 * // FooEvent.ts
 * import {generateEventTypes, EVENT_TYPE_PLACEHOLDER} from 'seng-event/lib/util/eventTypeUtils';
 * class FooEvent extends AbstractEvent {
 *    ...
 *    public static COMPLETE:string = EVENT_TYPE_PLACEHOLDER;
 *    ...
 * }
 * generateEventTypes({FooEvent});
 * // BarEvent.ts
 * import {generateEventTypes, EVENT_TYPE_PLACEHOLDER} from 'seng-event/lib/util/eventTypeUtils';
 * class BarEvent extends AbstractEvent {
 *    ...
 *    public static COMPLETE:string = EVENT_TYPE_PLACEHOLDER;
 *    ...
 * }
 * generateEventTypes({BarEvent});
 * ```
 *
 * What this util technically does is it loops through the given object's properties and replaces values
 * with _ClassName/propertyName_ every time it encounters a value equal to [[EVENT_TYPE_PLACEHOLDER]].
 *
 * The event class [[CommonEvent]] that is included with seng-event also uses this utility to generate
 * event names.
 *
 * @param targets An object containing the classes on which types should be generated. Because we cannot
 * reliably detect the name of any given Class, you have to pass an object with the names of the Classes as keys
 * and the classes themselves as values: `{ 'Class1' : Class1, 'Class2' : Class2 }`. Using the new ES6 property
 * names shorthand, we can simplify that to the following: `{ Class1, Class2 }`.
 */
export const generateEventTypes = (targets: { [name: string]: Object }): void => {
  Object.keys(targets).forEach(name => {
    const target = targets[name];
    Object.keys(target).forEach(prop => {
      if (target[prop] === EVENT_TYPE_PLACEHOLDER) {
        target[prop] = `${name}/${prop}`;
      }
    });
  });
};
