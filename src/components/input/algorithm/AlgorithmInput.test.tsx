import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { dfaA, dfaB } from "../../../algorithm/data/exampleData";
import { AlgorithmMode } from "../../../types/Algorithm";
import StatesInput from "../dfa/StatesInput";
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
        wrapper.find(StatesInput).at(0).props().convertInputCallback(dfaA);
        wrapper.find(StatesInput).at(1).props().convertInputCallback(dfaB);
    });
    let button = wrapper.find("button").at(4);
    expect(button.text()).toBe("Run");
    button.simulate("click");
    expect(runCallback).toHaveBeenCalledTimes(1);
    expect(runCallback).toHaveBeenCalledWith(dfaA, dfaB);
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
    expect(button.at(4).text()).toBe("Run");
    expect(button.get(4).props.disabled).toBe(true);
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
    let button = wrapper.find("button").at(4);
    expect(button.text()).toBe("Run");
    button.simulate("click");
    expect(runCallback).toHaveBeenCalledTimes(1);
    expect(runCallback).toHaveBeenCalledWith(dfaA, undefined);
});
