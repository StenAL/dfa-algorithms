import { mount } from "enzyme";
import { AlgorithmMode } from "../../../types/Algorithm";
import AlgorithmModeSwitch from "./AlgorithmModeSwitch";

it("switches mode on click", () => {
    let mode = AlgorithmMode.EQUIVALENCE_TESTING;
    let modeSwitch = mount(
        <AlgorithmModeSwitch
            mode={AlgorithmMode.EQUIVALENCE_TESTING}
            callback={(m) => {
                mode = m;
            }}
        />
    );
    let switchInput = modeSwitch.find('input[role="switch"]');
    switchInput.simulate("change");
    expect(mode).toBe(AlgorithmMode.STATE_MINIMIZATION);
    modeSwitch.setProps({ mode: AlgorithmMode.STATE_MINIMIZATION });
    switchInput = modeSwitch.find('input[role="switch"]');
    switchInput.simulate("change");
    expect(mode).toBe(AlgorithmMode.EQUIVALENCE_TESTING);
});
