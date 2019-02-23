import { createEventType } from 'seng-event';

// tslint:disable:no-useless-files

interface PlayerEventData {
  playerId: number;
}

class PlayerEvent extends createEventType<PlayerEventData>(false, true)('PLAY', 'STOP') {}

// $ExpectError
const playEvent = new PlayerEvent('PLAY');
