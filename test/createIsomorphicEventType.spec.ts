import createIsomorphicEventType from '../src/lib/createIsomorphicEventType';

describe('createIsomorphicEventType', () => {
  it('should use passed event config', () => {
    interface PlayerEventData {
      playerId: number;
    }

    interface PlayerUpdateEventData extends PlayerEventData {
      currentTime: number;
    }

    class IsoPlayerEvent<T extends 'PLAY' | 'STOP' | 'UPDATE'> extends createIsomorphicEventType<
      [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
      >()('PLAY', 'STOP', 'UPDATE')({ cancelable: true })<T> {}

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

    class IsoPlayerEvent<T extends 'PLAY' | 'STOP' | 'UPDATE'> extends createIsomorphicEventType<
      [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
      >()('PLAY', 'STOP', 'UPDATE')({ cancelable: true })<T> {}

    const updateEvent = new IsoPlayerEvent('UPDATE', { playerId: 1, currentTime: 10 });
    expect(updateEvent.cancelable).toBe(false);
    expect(updateEvent.bubbles).toBe(false);
    expect(updateEvent.timeStamp).toBe(0);
  });
});
