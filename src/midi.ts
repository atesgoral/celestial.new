export interface Input {
  id: string;
  name?: string;
  manufacturer?: string;
}

export class Midi {
  async getInputs() {
    const access = await navigator.requestMIDIAccess();

    const inputs: Input[] = [];

    for (let input of access.inputs.values()) {
      const id = input.id.toString();
      const { name, manufacturer } = input;

      inputs.push({ id, name, manufacturer });
    }

    return inputs;
  }
}
