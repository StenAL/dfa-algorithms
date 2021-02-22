import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { dfaA, dfaB } from "../../../algorithm/data/exampleData";
import { AlgorithmMode } from "../../../types/Algorithm";
import { serializeDfa } from "../../../util/util";
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

it("saving input to file works", function (done) {
    const consoleError = console.error;
    console.error = jest.fn(); // temporarily mock this to avoid JSDOM error about navigation
    const createUrlMock = jest.fn((_) => "fake-url");
    global.URL.createObjectURL = createUrlMock;
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <AlgorithmInput {...props} />
                </BrowserRouter>
            ),
            {
                mode: AlgorithmMode.STATE_MINIMIZATION,
                runCallback: jest.fn(),
                runLink: "/test",
            }
        )
    );
    act(() => {
        wrapper.find(StatesInput).props().convertInputCallback(dfaA);
    });

    let button = wrapper.find("button").at(3);
    expect(button.text()).toBe("Save to File");
    button.simulate("click");

    expect(createUrlMock).toHaveBeenCalledTimes(1);
    const argument = createUrlMock.mock.calls[0][0] as Blob;

    const reader = new FileReader();
    reader.addEventListener("loadend", function (_) {
        expect(reader.result).toEqual(
            JSON.stringify({ input1: JSON.stringify(serializeDfa(dfaA)), input2: "0" })
        );
        console.error = consoleError;
        done();
    });

    reader.readAsText(argument);
});
