import { mount, shallow } from "enzyme";
import { DFA } from "../../types/DFA";
import DatasetGenerator from "./DatasetGenerator";

it("generates DFA according to parameters", function () {
    const callback = jest.fn();
    const statesCount = 10;
    const finalStatesCount = 5;
    const wrapper = shallow(
        <DatasetGenerator
            statePrefix={"test"}
            existingDfa={undefined}
            alphabet={["0", "1"]}
            callback={callback}
        />
    );

    const statesCountInput = wrapper.find('input[name="statesCount"]');
    statesCountInput.simulate("change", { target: { value: statesCount.toString() } });
    const finalStatesCountInput = wrapper.find('input[name="finalStatesCount"]');
    finalStatesCountInput.simulate("change", { target: { value: finalStatesCount.toString() } });
    expect(finalStatesCountInput.hasClass("invalid-input")).toBe(false);
    expect(statesCountInput.hasClass("invalid-input")).toBe(false);

    const generateButton = wrapper.find("button");
    generateButton.simulate("click");
    expect(callback).toHaveBeenCalledTimes(1);
    const dfa: DFA = callback.mock.calls[0][0];
    expect(dfa.states.map((s) => s.name).every((name) => name.startsWith("test"))).toBe(true);
    expect(dfa.states.length).toBe(statesCount);
    expect(dfa.finalStates.size).toBe(finalStatesCount);
});

it("validates input", function () {
    const callback = jest.fn();
    const statesCount = 3;
    const finalStatesCount = 5;
    const wrapper = mount(
        <DatasetGenerator
            statePrefix={"test"}
            existingDfa={undefined}
            alphabet={["0", "1"]}
            callback={callback}
        />
    );

    let statesCountInput = wrapper.find('input[name="statesCount"]');
    statesCountInput.simulate("change", { target: { value: statesCount.toString() } });
    let finalStatesCountInput = wrapper.find('input[name="finalStatesCount"]');
    finalStatesCountInput.simulate("change", { target: { value: finalStatesCount.toString() } });

    finalStatesCountInput = wrapper.find('input[name="finalStatesCount"]');
    expect(finalStatesCountInput.hasClass("invalid-input")).toBe(true);

    finalStatesCountInput.simulate("change", { target: { value: "1" } });
    finalStatesCountInput = wrapper.find('input[name="finalStatesCount"]');
    expect(finalStatesCountInput.hasClass("invalid-input")).toBe(false);
});
