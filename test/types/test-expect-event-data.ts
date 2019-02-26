import { createEventClass } from 'seng-event';

// tslint:disable:no-useless-files

interface PlayerEventData {
  playerId: number;
}

class PlayerEvent extends createEventClass<PlayerEventData>(false, true)('PLAY', 'STOP') {}

// $ExpectError
const playEvent = new PlayerEvent('PLAY');
