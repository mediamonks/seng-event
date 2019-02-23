import createEventClass from '../src/lib/createEventClass';

describe('createEventClass', () => {
  it('should use passed event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    class PlayerEvent extends createEventClass<PlayerEventData>(false, true)('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY', { playerId: 1 });
    expect(playEvent.cancelable).toBe(true);
  });
  it('should use defaults for no event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    class PlayerEvent extends createEventClass<PlayerEventData>()('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY', { playerId: 1 });
    expect(playEvent.cancelable).toBe(false);
    expect(playEvent.bubbles).toBe(false);
    expect(playEvent.timeStamp).toBe(0);
  });
  it('should allow event creation without data if TData=void', () => {
    class PlayerEvent extends createEventClass()('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY');
    expect(playEvent.data).toBeUndefined();
  });
  it('should return a new event when calling clone()', () => {
    class PlayerEvent extends createEventClass()('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY');
    const playEvent2 = playEvent.clone();
    expect(playEvent).not.toBe(playEvent2);
  });
});
