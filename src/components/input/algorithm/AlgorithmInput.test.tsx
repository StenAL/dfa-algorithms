import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { exampleDfa1, exampleDfa2 } from "../../../algorithm/data/exampleData";
import { AlgorithmMode } from "../../../types/Algorithm";
import DfaInput from "../dfa/DfaInput";
import AlgorithmInput from "./AlgorithmInput";

it("passes DFA input to callback", function () {
    const runCallback = jest.fn();
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <AlgorithmInput {...props} />
                </BrowserRouter>
            ),
            {
                mode: AlgorithmMode.EQUIVALENCE_TESTING,
                runCallback: runCallback,
                runLink: "/test",
            }
        )
    );
    act(() => {
        wrapper.find(DfaInput).at(0).props().convertInputCallback(exampleDfa1);
        wrapper.find(DfaInput).at(1).props().convertInputCallback(exampleDfa2);
    });
    let button = wrapper
        .find("button")
        .findWhere((b) => b.text() === "Run")
        .at(0);
    expect(button.exists()).toBe(true);
    button.simulate("click");
    expect(runCallback).toHaveBeenCalledTimes(1);
    expect(runCallback).toHaveBeenCalledWith(exampleDfa1, exampleDfa2);
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

    let button = wrapper
        .find("button")
        .findWhere((b) => b.text() === "Run")
        .at(0);
    expect(button.exists()).toBe(true);
    expect(button.props().disabled).toBe(true);
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
    expect(wrapper.find(DfaInput).length).toBe(1);
    act(() => {
        wrapper.find(DfaInput).props().convertInputCallback(exampleDfa1);
    });
    let button = wrapper
        .find("button")
        .findWhere((b) => b.text() === "Run")
        .at(0);
    expect(button.exists()).toBe(true);
    button.simulate("click");
    expect(runCallback).toHaveBeenCalledTimes(1);
    expect(runCallback).toHaveBeenCalledWith(exampleDfa1, undefined);
});
