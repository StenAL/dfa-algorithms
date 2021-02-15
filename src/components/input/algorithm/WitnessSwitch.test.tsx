import { render, fireEvent, getByRole } from "@testing-library/react";
import WitnessSwitch from "./WitnessSwitch";

it("calls callback with correct value", () => {
    let produceWitness = false;
    let modeSwitch = render(
        <WitnessSwitch
            produceWitness={produceWitness}
            callback={(p) => {
                produceWitness = p;
            }}
        />
    );
    fireEvent.click(getByRole(modeSwitch.container, "switch"));
    expect(produceWitness).toBe(true);
});
