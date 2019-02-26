import createEventClass from "../src/lib/createEventClass";
import eventHasType from "../src/lib/eventHasType";

describe('eventHasType', () => {
  it('should correctly assert the type of an event', () => {

    class PlayerEvent extends createEventClass()('PLAY', 'STOP') {}
    const playEvent = new PlayerEvent('PLAY');
    expect(eventHasType(playEvent, PlayerEvent.types.PLAY)).toBe(true);
    expect(eventHasType(playEvent, PlayerEvent.types.STOP)).toBe(false);
  });
});
