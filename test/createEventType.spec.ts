import createEventType from '../src/lib/createEventType';

describe('createEventType', () => {
  it('should use passed event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    class PlayerEvent extends createEventType<PlayerEventData>(false, true)('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY', { playerId: 1 });
    expect(playEvent.cancelable).toBe(true);
  });
  it('should use defaults for no event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    class PlayerEvent extends createEventType<PlayerEventData>()('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY', { playerId: 1 });
    expect(playEvent.cancelable).toBe(false);
    expect(playEvent.bubbles).toBe(false);
    expect(playEvent.timeStamp).toBe(0);
  });
  it('should allow event creation without data if TData=void', () => {
    class PlayerEvent extends createEventType()('PLAY', 'STOP') {}

    const playEvent = new PlayerEvent('PLAY');
    expect(playEvent.data).toBeUndefined();
  });
});
