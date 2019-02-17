import createEventType from '../../src/lib/createEventType';
import createIsomorphicEventType from '../../src/lib/createIsomorphicEventType';
import EventDispatcher from '../../src/lib/EventDispatcher';

interface PlayerEventData {
  playerId: number;
}

interface PlayerUpdateEventData extends PlayerEventData {
  currentTime: number;
}

class PlayerEvent extends createEventType<PlayerEventData>()('PLAY', 'STOP') {}

// $ExpectType "PLAY"
PlayerEvent.types.PLAY;

// $ExpectError Argument of type '"someMadeUpString"' is not assignable
new PlayerEvent('someMadeUpString', { playerId: 5 });

// $ExpectType PlayerEvent
new PlayerEvent('PLAY', { playerId: 5 });

class IsoPlayerEvent extends createIsomorphicEventType<
  [PlayerEventData, PlayerEventData, PlayerUpdateEventData]
>({ cancelable: true })('PLAY', 'STOP', 'UPDATE') {}

// $ExpectType "UPDATE"
IsoPlayerEvent.types.UPDATE;

type IsoPlayerEventType = InstanceType<typeof IsoPlayerEvent>;

class Player extends EventDispatcher<IsoPlayerEventType> {}

const player = new Player();
player.addEventListener('PLAY', e => {
  // $ExpectType number
  e.data.playerId;
  // $ExpectError Property 'currentTime' does not exist
  e.data.currentTime;
});

player.addEventListener('UPDATE', e => {
  // $ExpectType number
  e.data.playerId;
  e.data.currentTime;
});
