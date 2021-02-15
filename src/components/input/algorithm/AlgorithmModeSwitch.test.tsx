import { render, fireEvent, getByRole } from "@testing-library/react";
import { AlgorithmMode } from "../../../types/Algorithm";
import AlgorithmModeSwitch from "./AlgorithmModeSwitch";

it("switches mode on click", () => {
    let mode = AlgorithmMode.EQUIVALENCE_TESTING;
    let modeSwitch = render(
        <AlgorithmModeSwitch
            mode={AlgorithmMode.EQUIVALENCE_TESTING}
            callback={(m) => {
                mode = m;
            }}
        />
    );
    fireEvent.click(getByRole(modeSwitch.container, "switch"));
    expect(mode).toBe(AlgorithmMode.STATE_MINIMIZATION);

    modeSwitch = render(
        <AlgorithmModeSwitch
            mode={AlgorithmMode.STATE_MINIMIZATION}
            callback={(m) => {
                mode = m;
            }}
        />
    );
    fireEvent.click(getByRole(modeSwitch.container, "switch"));
    expect(mode).toBe(AlgorithmMode.EQUIVALENCE_TESTING);
});
