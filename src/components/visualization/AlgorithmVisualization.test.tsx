import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { Link, MemoryRouter, Route } from "react-router-dom";
import { AlgorithmMode } from "../../types/Algorithm";
import { DFA, State } from "../../types/DFA";
import HopcroftAlgorithmVisualization from "./HopcroftAlgorithmVisualization";
import AlgorithmInput from "../input/algorithm/AlgorithmInput";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import WitnessSwitch from "../input/algorithm/WitnessSwitch";
import NearlyLinearAlgorithmVisualization from "./NearlyLinearAlgorithmVisualization";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";
import AlgorithmVisualization from "./AlgorithmVisualization";

const q1: State = {
    name: "q1",
    transitions: new Map(),
};
const q2: State = {
    name: "q2",
    transitions: new Map(),
};
q1.transitions.set("0", q2);
q1.transitions.set("1", q2);
q2.transitions.set("0", q2);
q2.transitions.set("1", q2);
const dfa: DFA = {
    states: [q1, q2],
    finalStates: new Set<State>([q1]),
    alphabet: ["0", "1"],
    startingState: q1,
};

it("renders witness switch only in EQUIVALENCE_TESTING mode", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/algorithm/table-filling/input"]} initialIndex={0}>
            <Route path={"/algorithm/:algorithmType/"}>
                <AlgorithmVisualization />
            </Route>
        </MemoryRouter>
    );
    expect(wrapper.find(AlgorithmModeSwitch).exists()).toBe(true);
    expect(wrapper.find(WitnessSwitch).exists()).toBe(true);

    act(() => {
        wrapper.find(AlgorithmModeSwitch).props().callback(AlgorithmMode.STATE_MINIMIZATION);
    });
    wrapper.setProps({});
    expect(wrapper.find(WitnessSwitch).exists()).toBe(false);
});

it("initializes table-filling algorithm correctly", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/algorithm/table-filling/input"]} initialIndex={0}>
            <Route path={"/algorithm/:algorithmType/"}>
                <AlgorithmVisualization />
            </Route>
        </MemoryRouter>
    );
    expect(wrapper.find("h2").text().includes("The Table-Filling Algorithm")).toBe(true);
    expect(wrapper.find(TableFillingAlgorithmVisualization).exists()).toBe(false);
    expect(wrapper.find(AlgorithmLog).exists()).toBe(false);
    expect(wrapper.find(AlgorithmStepControls).exists()).toBe(false);
    const runInputCallback = wrapper.find(AlgorithmInput).props().runCallback;
    act(() => {
        runInputCallback(dfa, dfa);
    });

    expect(wrapper.find(Link).at(3).text()).toBe("Run");
    wrapper.find(Link).at(3).simulate("click", { button: 0 });
    expect(wrapper.find(TableFillingAlgorithmVisualization).exists()).toBe(true);
    expect(wrapper.find(AlgorithmLog).exists()).toBe(true);
    expect(wrapper.find(AlgorithmLog).props().algorithm.type).toBe("tableFilling");
    expect(wrapper.find(AlgorithmStepControls).exists()).toBe(true);
});

it("initializes hopcroft algorithm correctly", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/algorithm/hopcroft/input"]} initialIndex={0}>
            <Route path={"/algorithm/:algorithmType/"}>
                <AlgorithmVisualization />
            </Route>
        </MemoryRouter>
    );
    expect(wrapper.find("h2").text().includes("Hopcroft Algorithm")).toBe(true);
    expect(wrapper.find(HopcroftAlgorithmVisualization).exists()).toBe(false);
    expect(wrapper.find(AlgorithmLog).exists()).toBe(false);
    expect(wrapper.find(AlgorithmStepControls).exists()).toBe(false);
    const runInputCallback = wrapper.find(AlgorithmInput).props().runCallback;
    act(() => {
        runInputCallback(dfa, dfa);
    });

    expect(wrapper.find(Link).at(3).text()).toBe("Run");
    wrapper.find(Link).at(3).simulate("click", { button: 0 });
    expect(wrapper.find(HopcroftAlgorithmVisualization).exists()).toBe(true);
    expect(wrapper.find(AlgorithmLog).exists()).toBe(true);
    expect(wrapper.find(AlgorithmLog).props().algorithm.type).toBe("hopcroft");
    expect(wrapper.find(AlgorithmStepControls).exists()).toBe(true);
});

it("initializes nearly linear algorithm correctly", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/algorithm/nearly-linear/input"]} initialIndex={0}>
            <Route path={"/algorithm/:algorithmType/"}>
                <AlgorithmVisualization />
            </Route>
        </MemoryRouter>
    );
    expect(wrapper.find("h2").text().includes("(Nearly) Linear Algorithm")).toBe(true);
    expect(wrapper.find(NearlyLinearAlgorithmVisualization).exists()).toBe(false);
    expect(wrapper.find(AlgorithmLog).exists()).toBe(false);
    expect(wrapper.find(AlgorithmStepControls).exists()).toBe(false);
    const runInputCallback = wrapper.find(AlgorithmInput).props().runCallback;
    act(() => {
        runInputCallback(dfa, dfa);
    });

    expect(wrapper.find(Link).at(3).text()).toBe("Run");
    wrapper.find(Link).at(3).simulate("click", { button: 0 });
    expect(wrapper.find(NearlyLinearAlgorithmVisualization).exists()).toBe(true);
    expect(wrapper.find(AlgorithmLog).exists()).toBe(true);
    expect(wrapper.find(AlgorithmLog).props().algorithm.type).toBe("nearlyLinear");
    expect(wrapper.find(AlgorithmStepControls).exists()).toBe(true);
});
