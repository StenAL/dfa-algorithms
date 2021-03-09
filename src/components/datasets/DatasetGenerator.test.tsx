import { mount } from "enzyme";
import DownloadButton from "../input/algorithm/DownloadButton";
import DatasetGenerator from "./DatasetGenerator";

it("generates DFA according to parameters", function () {
    const statesCount = 10;
    const finalStatesCount = 5;
    const wrapper = mount(
        <DatasetGenerator callback={jest.fn()} statePrefix={"test"} alphabet={["0", "1"]} />
    );

    const statesCountInput = wrapper.find('input[name="statesCount"]');
    statesCountInput.simulate("change", { target: { value: statesCount.toString() } });
    const finalStatesCountInput = wrapper.find('input[name="finalStatesCount"]');
    finalStatesCountInput.simulate("change", { target: { value: finalStatesCount.toString() } });
    expect(finalStatesCountInput.hasClass("invalid-input")).toBe(false);
    expect(statesCountInput.hasClass("invalid-input")).toBe(false);

    const generateButton = wrapper
        .find("button")
        .findWhere((el) => el.text() === "Generate")
        .at(0);
    generateButton.simulate("click");
    const downloadButton = wrapper.find(DownloadButton);
    const dfa = downloadButton.props().dfa!;
    expect(dfa.states.map((s) => s.name).every((name) => name.startsWith("test"))).toBe(true);
    expect(dfa.states.length).toBe(statesCount);
    expect(dfa.finalStates.size).toBe(finalStatesCount);
});

it("validates input", function () {
    const statesCount = 3;
    const finalStatesCount = 5;
    const wrapper = mount(
        <DatasetGenerator callback={jest.fn()} statePrefix={"test"} alphabet={["0", "1"]} />
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
