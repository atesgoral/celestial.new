import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {useMidi} from './hooks/use-midi';
import {Input} from './midi';

interface MidiInputProps {
  inputs: Input[];
  defaultSelectedId?: string;
  onChange?: (id?: string) => void;
}

function MidiInputSelector({inputs, defaultSelectedId, onChange}: MidiInputProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultSelectedId || '');

  function handleSelectionChange(id: string) {
    setSelectedId(id);
    if (onChange) {
      onChange(id || undefined);
    }
  }

  return (
    <select value={selectedId} onChange={(event) => handleSelectionChange(event.target.value)}>
      <option key="" value="">None</option>
      {inputs.map(({id, name, manufacturer}) => (
        <option key={id} value={id}>{name} ({manufacturer})</option>
      ))}
    </select>
  );
}

interface MidiChannelEventsProps {
  input: Input;
  channel: number;
}

function MidiChannelEvents({input, channel}: MidiChannelEventsProps) {
  return (
    <pre>{
      input.events
        .filter((event) => event.channel === channel)
        .map(({channel, note, velocity}) => `${channel}: ${note}@${velocity}`)
        .join('')
    }</pre>
  );
}

interface MidiEventsProps {
  input: Input;
}

function MidiEvents({input}: MidiEventsProps) {
  const channels: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <>
      {
        channels
          .map((channel: number) => <MidiChannelEvents key={channel} input={input} channel={channel} />)
      }
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [selectedInput, setSelectedInput] = useState<Input | undefined>(undefined);

  const midi = useMidi();

  useEffect(() => {
    (async () => {
      setInputs(await midi.getInputs());
      setLoading(false);
    })();
  });

  const handleInputChange = useCallback((id?: string) => {
    setSelectedInput(inputs.find((input) => input.id === id));
  }, [inputs]);

  const content = loading
    ? 'Loading...'
    : <>
      <MidiInputSelector
        inputs={inputs}
        defaultSelectedId={selectedInput && selectedInput.id}
        onChange={handleInputChange}
      />
      {selectedInput && <MidiEvents input={selectedInput} />}
    </>;

  return (
    <>
      {content}
    </>
  );
}

export default App;
