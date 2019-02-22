import EventDispatcher, { createEventType, createIsomorphicEventType } from 'seng-event';

interface PlayerEventData {
  playerId: number;
}

class PlayerEvent extends createEventType<PlayerEventData>()('PLAY', 'STOP') {}

// $ExpectType "PLAY"
PlayerEvent.types.PLAY;

// $ExpectError
new PlayerEvent('someMadeUpString', { playerId: 5 });

// $ExpectType PlayerEvent
new PlayerEvent('PLAY', { playerId: 5 });
