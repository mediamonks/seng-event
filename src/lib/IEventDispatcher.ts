import { IEvent } from './IEvent';
import EventListenerData from './EventListenerData';
import { EventHandler } from './EventDispatcher';

export interface IEventDispatcher {
  dispatchEvent(event: IEvent): boolean;

  addEventListener(
    type: string,
    handler: EventHandler,
    useCapture?: boolean,
    priority?: number,
  ): EventListenerData;

  hasEventListener(type: string, handler?: EventHandler, useCapture?: boolean): boolean;

  willTrigger(type: string): boolean;

  removeEventListener(type: string, handler: EventHandler, useCapture?: boolean): void;

  removeAllEventListeners(type?: string): void;

  dispose(): void;
}
