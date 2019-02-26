import EventDispatcher, { createEventClass } from 'seng-event';

class EventA extends createEventClass<{ a: number }>()('FOO_A', 'BAR_A') {}
class EventB extends createEventClass<{ b: number }>()('FOO_B', 'BAR_B') {}

class DispatcherA extends EventDispatcher<EventA> {}
class DispatcherB extends EventDispatcher<EventB> {}

const dispatcherA = new DispatcherA();
// $ExpectType DispatcherB
new DispatcherB(dispatcherA);
