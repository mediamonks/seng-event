import createEventType from '../../src/lib/createEventType';

interface PlayerEventData {
  id: number;
}


const PlayerEvent = createEventType<PlayerEventData>()(['PLAY', 'STOP']);

// $ExpectError Argument of type '"someMadeUpString"' is not assignable
const myEvent = new PlayerEvent('someMadeUpString', { playerId: 5 });
