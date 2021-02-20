import { shallow, mount } from "enzyme";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { dfaA, dfaB } from "../../../algorithm/data/exampleData";
import { AlgorithmMode } from "../../../types/Algorithm";
import "./PreGeneratedInputs";
import { serializeDfa } from "../../../util/util";
import PreGeneratedInputs from "./PreGeneratedInputs";

it("passes correct inputs for equivalence testing", function () {
    const callback = jest.fn();
    const wrapper = shallow(
        <PreGeneratedInputs
            mode={AlgorithmMode.EQUIVALENCE_TESTING}
            runLink={"test"}
            runCallback={callback}
        />
    );
    const exampleInputs = wrapper.find("button").at(0);
    exampleInputs.simulate("click");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(dfaA, dfaB);
});

it("passes correct inputs for state minimization", function () {
    const callback = jest.fn();
    const wrapper = shallow(
        <PreGeneratedInputs
            mode={AlgorithmMode.STATE_MINIMIZATION}
            runLink={"test"}
            runCallback={callback}
        />
    );
    const exampleInputs = wrapper.find("button").at(0);
    exampleInputs.simulate("click");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(dfaA, undefined);
});

it("loads correct data from file", function (done) {
    const callback = jest.fn();
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <PreGeneratedInputs {...props} />
                </BrowserRouter>
            ),
            {
                mode: AlgorithmMode.STATE_MINIMIZATION,
                runCallback: callback,
                runLink: "/test",
            }
        )
    );
    const data = JSON.stringify({ input1: JSON.stringify(serializeDfa(dfaA)), input2: "0" });
    const file = { text: () => data };

    const fileInput = wrapper.find("input");
    fileInput.simulate("change", { target: { files: { item: () => file } } });
    setImmediate(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenLastCalledWith(dfaA, undefined);
        done();
    });
});
