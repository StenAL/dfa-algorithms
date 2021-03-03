import HashMap from "hashmap";
import React from "react";
import { act } from "react-dom/test-utils";
import DfaInput from "./DfaInput";
import { mount, shallow } from "enzyme";
import TransitionsInput from "./TransitionsInput";

it("should disallow duplicate state names", function () {
    const wrapper = shallow(
        <DfaInput
            alphabet={["0", "1"]}
            existingTransitions={[]}
            existingFinalStates={[]}
            existingStates={[]}
            alphabetValid={true}
            convertInputCallback={() => {}}
        />
    );
    let stateInput = wrapper.find('input[name="states"]');
    expect(stateInput.hasClass("invalid-input")).toBe(true);
    stateInput.simulate("change", { target: { value: "q1,q2" } });

    stateInput = wrapper.find('input[name="states"]');
    expect(stateInput.hasClass("invalid-input")).toBe(false);
});

it("should only allow valid final states", function () {
    const wrapper = shallow(
        <DfaInput
            alphabet={["0", "1"]}
            existingTransitions={[]}
            existingFinalStates={[]}
            existingStates={[]}
            alphabetValid={true}
            convertInputCallback={() => {}}
        />
    );
    let stateInput = wrapper.find('input[name="states"]');
    let finalStateInput = wrapper.find('input[name="finalStates"]');
    stateInput.simulate("change", { target: { value: "q1,q2" } });
    finalStateInput.simulate("change", { target: { value: "q3" } });

    finalStateInput = wrapper.find('input[name="finalStates"]');
    expect(finalStateInput.hasClass("invalid-input")).toBe(true);

    finalStateInput.simulate("change", { target: { value: "q2" } });
    finalStateInput = wrapper.find('input[name="finalStates"]');
    expect(finalStateInput.hasClass("invalid-input")).toBe(false);

    finalStateInput.simulate("change", { target: { value: "q2,q2" } });
    finalStateInput = wrapper.find('input[name="finalStates"]');
    expect(finalStateInput.hasClass("invalid-input")).toBe(true);
});

it("should remove transitions when states are removed", function () {
    const wrapper = mount(
        <DfaInput
            alphabet={["0", "1"]}
            existingTransitions={[]}
            existingFinalStates={[]}
            existingStates={[]}
            alphabetValid={true}
            convertInputCallback={() => {}}
        />
    );
    let stateInput = wrapper.find('input[name="states"]');
    stateInput.simulate("change", { target: { value: "q1,q2" } });
    let transitionInput = wrapper.find(TransitionsInput);
    let setTransition = transitionInput.props().setTransition;
    act(() => setTransition("q1", "0", "q2"));
    wrapper.setProps({});
    setTransition = wrapper.find(TransitionsInput).props().setTransition;
    act(() => setTransition("q1", "1", "q2"));
    wrapper.setProps({});
    setTransition = wrapper.find(TransitionsInput).props().setTransition;
    act(() => setTransition("q2", "0", "q2"));
    wrapper.setProps({});
    setTransition = wrapper.find(TransitionsInput).props().setTransition;
    act(() => setTransition("q2", "1", "q2"));
    wrapper.setProps({});
    transitionInput = wrapper.find(TransitionsInput);
    expect(transitionInput.props().transitions).toEqual(
        new HashMap([
            [["q1", "0"], "q2"],
            [["q1", "1"], "q2"],
            [["q2", "0"], "q2"],
            [["q2", "1"], "q2"],
        ])
    );
    stateInput.simulate("change", { target: { value: "q1" } });
    transitionInput = wrapper.find(TransitionsInput);
    expect(transitionInput.props().transitions).toEqual(
        new HashMap([
            [["q1", "0"], "q2"],
            [["q1", "1"], "q2"],
        ])
    );
});

it("should remove transitions when alphabet is changed", function () {
    const wrapper = mount(
        <DfaInput
            alphabet={["0", "1"]}
            existingTransitions={[]}
            existingFinalStates={[]}
            existingStates={[]}
            alphabetValid={true}
            convertInputCallback={() => {}}
        />
    );
    let stateInput = wrapper.find('input[name="states"]');
    stateInput.simulate("change", { target: { value: "q1,q2" } });
    let transitionInput = wrapper.find(TransitionsInput);
    let setTransition = transitionInput.props().setTransition;
    act(() => setTransition("q1", "0", "q2"));
    wrapper.setProps({});
    setTransition = wrapper.find(TransitionsInput).props().setTransition;
    act(() => setTransition("q1", "1", "q2"));
    wrapper.setProps({});
    setTransition = wrapper.find(TransitionsInput).props().setTransition;
    act(() => setTransition("q2", "0", "q2"));
    wrapper.setProps({});
    setTransition = wrapper.find(TransitionsInput).props().setTransition;
    act(() => setTransition("q2", "1", "q2"));
    wrapper.setProps({});
    transitionInput = wrapper.find(TransitionsInput);
    expect(transitionInput.props().transitions).toEqual(
        new HashMap([
            [["q1", "0"], "q2"],
            [["q1", "1"], "q2"],
            [["q2", "0"], "q2"],
            [["q2", "1"], "q2"],
        ])
    );
    wrapper.setProps({ alphabet: ["0"] });
    wrapper.setProps({});
    transitionInput = wrapper.find(TransitionsInput);
    expect(transitionInput.props().transitions).toEqual(
        new HashMap([
            [["q1", "0"], "q2"],
            [["q2", "0"], "q2"],
        ])
    );
});
