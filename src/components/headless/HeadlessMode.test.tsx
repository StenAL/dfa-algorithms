import { fireEvent, getByRole } from "@testing-library/react";
import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { Link, MemoryRouter, Route } from "react-router-dom";
import TableFillingAlgorithm from "../../algorithm/TableFillingAlgorithm";
import { DFA, State } from "../../types/DFA";
import AlgorithmInput from "../input/algorithm/AlgorithmInput";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import AlgorithmPicker from "../input/algorithm/AlgorithmPicker";
import WitnessSwitch from "../input/algorithm/WitnessSwitch";
import AlgorithmVisualization from "../visualization/AlgorithmVisualization";
import HeadlessMode from "./HeadlessMode";
import HeadlessModeRun from "./HeadlessModeRun";

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

it("initializes correct algorithms from selections", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/headless/input"]} initialIndex={0}>
            <HeadlessMode />
        </MemoryRouter>
    );
    act(() => {
        wrapper.find(AlgorithmPicker).props().setAlgorithmsSelected({
            nearlyLinear: true,
            hopcroft: true,
            hopcroftWitness: true,
            nearlyLinearWitness: true,
            tableFilling: true,
            tableFillingWitness: true,
        });
    });
    wrapper.setProps({});
    const runInputCallback = wrapper.find(AlgorithmInput).props().runCallback;
    act(() => {
        runInputCallback(dfa, dfa);
    });

    expect(wrapper.find(Link).at(0).text()).toBe("Run");
    wrapper.find(Link).at(0).simulate("click", { button: 0 });

    const headlessModeRun = wrapper.find(HeadlessModeRun);
    expect(headlessModeRun.exists()).toBe(true);
    expect(headlessModeRun.props().algorithms).toEqual([
        new TableFillingAlgorithm(dfa, dfa),
        new TableFillingAlgorithm(dfa, dfa, true),
    ]);
});

it("unchecks invalid algorithms in STATE_MINIMIZATION mode", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/headless/input"]} initialIndex={0}>
            <HeadlessMode />
        </MemoryRouter>
    );
    let algorithmPicker = wrapper.find(AlgorithmPicker);
    act(() => {
        algorithmPicker.props().setAlgorithmsSelected({
            nearlyLinear: true,
            hopcroft: true,
            hopcroftWitness: true,
            nearlyLinearWitness: true,
            tableFilling: true,
            tableFillingWitness: true,
        });
    });
    const modeSwitch = wrapper.find('input[role="switch"]');
    modeSwitch.simulate("change");
    wrapper.setProps({});
    algorithmPicker = wrapper.find(AlgorithmPicker);
    expect(algorithmPicker.props().algorithmsSelected).toEqual({
        hopcroft: true,
        tableFilling: true,
        hopcroftWitness: false,
        nearlyLinear: false,
        nearlyLinearWitness: false,
        tableFillingWitness: false,
    });
});
