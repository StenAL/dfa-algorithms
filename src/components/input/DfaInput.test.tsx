import React from "react";
import { act } from "react-dom/test-utils";
import DfaInput from "./DfaInput";
import { mount, shallow } from "enzyme";
import TransitionsInput from "./TransitionsInput";

it("should disallow duplicate state names", function () {
    const wrapper = shallow(
        <DfaInput
            alphabet={["0", "1"]}
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
            alphabetValid={true}
            convertInputCallback={() => {}}
        />
    );
    let stateInput = wrapper.find('input[name="states"]');
    stateInput.simulate("change", { target: { value: "q1,q2" } });
    let transitionInput = wrapper.find(TransitionsInput);
    const setTransition = transitionInput.props().setTransition;
    act(() => setTransition("q1", "0", "q2"));
    act(() => setTransition("q1", "1", "q2"));
    act(() => setTransition("q2", "0", "q2"));
    act(() => setTransition("q2", "1", "q2"));
    expect(transitionInput.props().transitions).toEqual(
        new Map([
            [
                "q1",
                new Map([
                    ["0", "q2"],
                    ["1", "q2"],
                ]),
            ],
            [
                "q2",
                new Map([
                    ["0", "q2"],
                    ["1", "q2"],
                ]),
            ],
        ])
    );
    stateInput.simulate("change", { target: { value: "q1" } });
    transitionInput = wrapper.find(TransitionsInput);
    expect(transitionInput.props().transitions).toEqual(
      new Map([
          [
              "q1",
              new Map([
                  ["0", "q2"],
                  ["1", "q2"],
              ]),
          ],
      ])
    );
});

it("should remove transitions when alphabet is changed", function () {
    const wrapper = mount(
      <DfaInput
        alphabet={["0", "1"]}
        alphabetValid={true}
        convertInputCallback={() => {}}
      />
    );
    let stateInput = wrapper.find('input[name="states"]');
    stateInput.simulate("change", { target: { value: "q1,q2" } });
    let transitionInput = wrapper.find(TransitionsInput);
    const setTransition = transitionInput.props().setTransition;
    act(() => setTransition("q1", "0", "q2"));
    act(() => setTransition("q1", "1", "q2"));
    act(() => setTransition("q2", "0", "q2"));
    act(() => setTransition("q2", "1", "q2"));
    expect(transitionInput.props().transitions).toEqual(
      new Map([
          [
              "q1",
              new Map([
                  ["0", "q2"],
                  ["1", "q2"],
              ]),
          ],
          [
              "q2",
              new Map([
                  ["0", "q2"],
                  ["1", "q2"],
              ]),
          ],
      ])
    );
    wrapper.setProps({alphabet: ["0"]})
    transitionInput = wrapper.find(TransitionsInput);
    expect(transitionInput.props().transitions).toEqual(
      new Map([
          [
              "q1",
              new Map([
                  ["0", "q2"],
              ]),
          ],
          [
              "q2",
              new Map([
                  ["0", "q2"],
              ]),
          ],
      ])
    );
});