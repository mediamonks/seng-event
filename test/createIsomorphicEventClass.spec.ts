import createIsomorphicEventClass from '../src/lib/createIsomorphicEventClass';

describe('createIsomorphicEventClass', () => {
  it('should use passed event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    interface PlayerUpdateEventData extends PlayerEventData {
      currentTime: number;
    }

    class IsoPlayerEvent<T extends 'PLAY' | 'STOP' | 'UPDATE'> extends createIsomorphicEventClass<
      [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
      >({ cancelable: true })('PLAY', 'STOP', 'UPDATE')<T> {}

    const playEvent = new IsoPlayerEvent('PLAY', { playerId: 1 });
    expect(playEvent.cancelable).toBe(true);
  });
  it('should use defaults for undefined event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    interface PlayerUpdateEventData extends PlayerEventData {
      currentTime: number;
    }

    class IsoPlayerEvent<T extends 'PLAY' | 'STOP' | 'UPDATE'> extends createIsomorphicEventClass<
      [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
    >({ cancelable: true })('PLAY', 'STOP', 'UPDATE')<T> {}

    const updateEvent = new IsoPlayerEvent('UPDATE', { playerId: 1, currentTime: 10 });
    expect(updateEvent.cancelable).toBe(false);
    expect(updateEvent.bubbles).toBe(false);
    expect(updateEvent.timeStamp).toBe(0);
  });
  it('should return a new event when calling clone()', () => {
    interface PlayerEventData {
      playerId: number;
    }

    interface PlayerUpdateEventData extends PlayerEventData {
      currentTime: number;
    }

    class IsoPlayerEvent<T extends 'PLAY' | 'STOP' | 'UPDATE'> extends createIsomorphicEventClass<
      [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
      >({ cancelable: true })('PLAY', 'STOP', 'UPDATE')<T> {}

    const playEvent = new IsoPlayerEvent('PLAY', { playerId: 1 });
    const playEvent2 = playEvent.clone();
    expect(playEvent).not.toBe(playEvent2);
  });
});
