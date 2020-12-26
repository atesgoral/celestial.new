import {useContext} from 'react';
import {MidiContext} from '../midi-context';

export function useMidi() {
  return useContext(MidiContext);
}
