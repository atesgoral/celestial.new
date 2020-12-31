interface Event {
  channel: number;
  note: number;
  velocity: number;
}

export interface Input {
  id: string;
  name?: string;
  manufacturer?: string;
  events: Event[];
  lastEventTimeStamp?: number;
}

export class Midi {
  static inputMap: Map<string, Input> = new Map();
  static inputs: Input[];

  async getInputs() {
    const access = await navigator.requestMIDIAccess();

    for (let accessInput of access.inputs.values()) {
      const {id, name, manufacturer} = accessInput;

      let input = Midi.inputMap.get(id);

      if (!input) {
        input = {id, name, manufacturer, events: []};

        Midi.inputMap.set(id, input);
        Midi.inputs = Array.from(Midi.inputMap.values());

        accessInput.onmidimessage = (message) => {
          const {timeStamp} = message;
          const [status, data1, data2] = message.data;
          const channel = status & 0x0f;
          const note = data1;
          const velocity = data2;

          input!.events.push({channel, note, velocity});
          // input!.events = input!.events.concat({channel, note, velocity});
          input!.lastEventTimeStamp = timeStamp;
        };
      }
    }

    return Midi.inputs;
  }
}
