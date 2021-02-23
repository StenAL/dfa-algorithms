import { mount } from "enzyme";
import WitnessSwitch from "./WitnessSwitch";

it("calls callback with correct value", () => {
    let produceWitness = false;
    let modeSwitch = mount(
        <WitnessSwitch
            produceWitness={produceWitness}
            callback={(p) => {
                produceWitness = p;
            }}
        />
    );
    const switchInput = modeSwitch.find('input[role="switch"]');
    switchInput.simulate("change");
    expect(produceWitness).toBe(true);
});
