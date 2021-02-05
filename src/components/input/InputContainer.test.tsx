import { mount } from "enzyme";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AlgorithmMode } from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import AlgorithmModeSwitch from "./AlgorithmModeSwitch";
import InputContainer from "./InputContainer";

it("renders mode switch only when needed", function () {
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
    expect(wrapper.find(AlgorithmModeSwitch).exists()).toBe(false);
    wrapper.setProps({
        modes: [
            AlgorithmMode.EQUIVALENCE_TESTING,
            AlgorithmMode.STATE_MINIMIZATION,
        ],
    });
    expect(wrapper.find(AlgorithmModeSwitch).exists()).toBe(true);
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
