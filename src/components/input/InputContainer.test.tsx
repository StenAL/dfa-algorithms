import { fireEvent, getByDisplayValue, getByText } from "@testing-library/react";
import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { dfaA } from "../../algorithm/data";
import { AlgorithmMode } from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import AlgorithmModeSwitch from "./AlgorithmModeSwitch";
import DfaInput from "./DfaInput";
import InputContainer from "./InputContainer";
import WitnessSwitch from "./WitnessSwitch";

it("renders mode switch only when multiple modes are available and witness switch only in EQUIVALENCE_TESTING mode", function () {
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <InputContainer {...props} />
                </BrowserRouter>
            ),
            {
                modes: [AlgorithmMode.STATE_MINIMIZATION],
                runCallback: (a: DFA | undefined, b: DFA | undefined) => {},
                runLink: "/test",
            }
        )
    );
    expect(wrapper.find(AlgorithmModeSwitch).exists()).toBe(false);
    expect(wrapper.find(WitnessSwitch).exists()).toBe(false);
    wrapper.setProps({
        modes: [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION],
    });
    act(() => {
        wrapper.find(AlgorithmModeSwitch).props().callback(AlgorithmMode.EQUIVALENCE_TESTING);
    });
    wrapper.setProps({});
    expect(wrapper.find(AlgorithmModeSwitch).exists()).toBe(true);
    expect(wrapper.find(WitnessSwitch).exists()).toBe(true);
});

it("validates alphabet", function () {
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <InputContainer {...props} />
                </BrowserRouter>
            ),
            {
                modes: [AlgorithmMode.EQUIVALENCE_TESTING],
                runCallback: (a: DFA | undefined, b: DFA | undefined) => {},
                runLink: "/test",
            }
        )
    );
    let alphabetInput = wrapper.find('input[name="alphabet"]');
    expect(alphabetInput.hasClass("invalid-input")).toBe(true);
    alphabetInput.simulate("change", { target: { value: "0,1" } });

    alphabetInput = wrapper.find('input[name="alphabet"]');
    expect(alphabetInput.hasClass("invalid-input")).toBe(false);
});

it("prevents invalid input from being run", function () {
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <InputContainer {...props} />
                </BrowserRouter>
            ),
            {
                modes: [AlgorithmMode.EQUIVALENCE_TESTING],
                runCallback: (a: DFA | undefined, b: DFA | undefined) => {},
                runLink: "/test",
            }
        )
    );
    let alphabetInput = wrapper.find('input[name="alphabet"]');
    alphabetInput.simulate("change", { target: { value: "1,1" } });

    let button = wrapper.find("button");
    expect(button.get(0).props.disabled).toBe(true);
});

it("only passes one DFA in callback when in STATE_MINIMIZATION mode", function () {
    const runCallback = jest.fn();
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <InputContainer {...props} />
                </BrowserRouter>
            ),
            {
                modes: [AlgorithmMode.STATE_MINIMIZATION],
                runCallback: runCallback,
                runLink: "/test",
            }
        )
    );
    expect(wrapper.find(DfaInput).length).toBe(1);
    act(() => {
        wrapper.find(DfaInput).props().convertInputCallback(dfaA);
    });
    let button = wrapper.find("button");
    button.at(0).simulate("click");
    expect(runCallback).toHaveBeenCalledTimes(1);
    expect(runCallback).toHaveBeenCalledWith(dfaA, undefined, false);
});
