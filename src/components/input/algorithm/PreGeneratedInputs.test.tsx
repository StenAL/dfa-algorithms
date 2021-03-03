import { shallow } from "enzyme";
import React from "react";
import { exampleDfa1, exampleDfa2 } from "../../../algorithm/data/exampleData";
import { AlgorithmMode } from "../../../types/Algorithm";
import "./PreGeneratedInputs";
import PreGeneratedInputs from "./PreGeneratedInputs";

it("passes correct inputs for equivalence testing", function () {
    const callback = jest.fn();
    const wrapper = shallow(
        <PreGeneratedInputs mode={AlgorithmMode.EQUIVALENCE_TESTING} runCallback={callback} />
    );
    const exampleInputs = wrapper.find("button").at(0);
    exampleInputs.simulate("click");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(exampleDfa1, exampleDfa2);
});

it("passes correct inputs for state minimization", function () {
    const callback = jest.fn();
    const wrapper = shallow(
        <PreGeneratedInputs mode={AlgorithmMode.STATE_MINIMIZATION} runCallback={callback} />
    );
    const exampleInputs = wrapper.find("button").at(0);
    exampleInputs.simulate("click");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(exampleDfa1, undefined);
});
