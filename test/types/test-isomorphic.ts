import EventDispatcher, { createIsomorphicEventType } from 'seng-event';

interface PlayerEventData {
  playerId: number;
}

interface PlayerUpdateEventData extends PlayerEventData {
  currentTime: number;
}

class IsoPlayerEvent extends createIsomorphicEventType<
  [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
  >({ cancelable: true })('PLAY', 'STOP', 'UPDATE') {}

// $ExpectType "UPDATE"
IsoPlayerEvent.types.UPDATE;

class Player extends EventDispatcher<IsoPlayerEvent> {}

const player = new Player();
player.addEventListener('PLAY', e => {
  // $ExpectType number
  e.data.playerId;
  // $ExpectError
  e.data.currentTime;
});

player.addEventListener('UPDATE', e => {
  // $ExpectType number
  e.data.playerId;
  e.data.currentTime;
});
