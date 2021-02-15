import { shallow } from "enzyme";
import { dfaA, dfaB } from "../../../algorithm/data";
import { AlgorithmMode } from "../../../types/Algorithm";
import "./PreGeneratedInputs";
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
