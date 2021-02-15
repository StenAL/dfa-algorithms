import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { dfaA } from "../../../algorithm/data";
import { AlgorithmMode } from "../../../types/Algorithm";
import { DFA } from "../../../types/DFA";
import StatesInput from "../dfa/StatesInput";
import AlgorithmInput from "./AlgorithmInput";

it("validates alphabet", function () {
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <AlgorithmInput {...props} />
                </BrowserRouter>
            ),
            {
                mode: AlgorithmMode.EQUIVALENCE_TESTING,
                runCallback: jest.fn(),
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
                    <AlgorithmInput {...props} />
                </BrowserRouter>
            ),
            {
                mode: AlgorithmMode.EQUIVALENCE_TESTING,
                runCallback: jest.fn(),
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
                    <AlgorithmInput {...props} />
                </BrowserRouter>
            ),
            {
                mode: AlgorithmMode.STATE_MINIMIZATION,
                runCallback: runCallback,
                runLink: "/test",
            }
        )
    );
    expect(wrapper.find(StatesInput).length).toBe(1);
    act(() => {
        wrapper.find(StatesInput).props().convertInputCallback(dfaA);
    });
    let button = wrapper.find("button");
    button.at(0).simulate("click");
    expect(runCallback).toHaveBeenCalledTimes(1);
    expect(runCallback).toHaveBeenCalledWith(dfaA, undefined);
});
