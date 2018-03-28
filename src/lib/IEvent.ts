import { IEventDispatcher } from './IEventDispatcher';
import EventPhase from './EventPhase';
import { EventHandler } from './EventDispatcher';
import CallListenerResult from './CallListenerResult';

export interface IEvent {
  type: string;

  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;

  target: IEventDispatcher;
  currentTarget: IEventDispatcher;
  timeStamp: number;

  eventPhase: EventPhase;

  callListener(handler: EventHandler): CallListenerResult;

  clone(): IEvent;

  stopPropagation(): void;

  stopImmediatePropagation(): void;

  preventDefault(): void;
}
