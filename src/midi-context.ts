import {createContext} from 'react';

import {Midi} from './midi';

export const MidiContext = createContext<Midi>(new Midi());

export const Provider = MidiContext.Provider;
