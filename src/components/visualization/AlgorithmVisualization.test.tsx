import { mount } from "enzyme";
import React from "react";
import {act} from "react-dom/test-utils";
import {Link, MemoryRouter, Route} from "react-router-dom";
import {DFA, State} from "../../types/DFA";
import InputContainer from "../input/InputContainer";
import TableFillingAlgorithmVisualization from "../TableFillingAlgorithmVisualization";
import AlgorithmVisualization from "./AlgorithmVisualization";

const q1: State = {
    name: "q1",
    transitions: new Map(),
};
const q2: State = {
    name: "q2",
    transitions: new Map(),
};
q1.transitions.set("0", q2)
q1.transitions.set("1", q2)
q2.transitions.set("0", q2)
q2.transitions.set("1", q2)
const dfa: DFA = {
    states: [q1, q2],
    finalStates: new Set<State>([q1]),
    alphabet: ["0", "1"],
    startingState: q1
}

it("initializes table-filling algorithm correctly", function () {
    const wrapper = mount(
        <MemoryRouter initialEntries={["/algorithm/table-filling/input"]} initialIndex={0}>
            <Route path={"/algorithm/:algorithmType/"}>
                <AlgorithmVisualization />
            </Route>
        </MemoryRouter>
    );
    expect(wrapper.find("h2").text().includes("The Table-Filling Algorithm")).toBe(true)
    expect(wrapper.find(TableFillingAlgorithmVisualization).exists()).toBe(false)
    const runInputCallback = wrapper.find(InputContainer).props().runCallback
    act(() => {
        runInputCallback(dfa, dfa);
    })

    expect(wrapper.find(Link).at(0).text()).toBe("Run");
    wrapper.find(Link).at(0).simulate("click", {button: 0});
    expect(wrapper.find(TableFillingAlgorithmVisualization).exists()).toBe(true)
}); 