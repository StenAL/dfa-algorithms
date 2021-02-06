import { shallow } from "enzyme";
import { TableFillingAlgorithmState } from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, CommonAlgorithmState } from "../../types/Algorithm";
import AlgorithmStepControls from "./AlgorithmStepControls";

it("call algorithm.step() on press and invokes callback", function () {
    const algorithm: Algorithm = {
        state: CommonAlgorithmState.INITIAL,
        reset: function () {
            this.state = CommonAlgorithmState.INITIAL;
        },
        type: "table-filling",
        step: function () {
            if (this.state === CommonAlgorithmState.INITIAL) {
                this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED;
            } else if (
                this.state === TableFillingAlgorithmState.ALL_PAIRS_MARKED
            ) {
                this.state = CommonAlgorithmState.FINAL;
            }
        },
    };
    const stepBackwardCallback = jest.fn();
    const stepForwardCallback = jest.fn();
    const wrapper = shallow(
        <AlgorithmStepControls
            algorithm={algorithm}
            stepBackwardCallback={stepBackwardCallback}
            stepForwardCallback={stepForwardCallback}
        />
    );
    let stepForwardButton = wrapper.find("button").at(2);
    stepForwardButton.simulate("click");
    expect(algorithm.state).toBe(TableFillingAlgorithmState.ALL_PAIRS_MARKED);
    stepForwardButton.simulate("click");
    expect(stepForwardCallback).toHaveBeenCalledTimes(2);
    expect(algorithm.state).toBe(CommonAlgorithmState.FINAL);
});

it("disables invalid step buttons", function () {
    const algorithm: Algorithm = {
        state: CommonAlgorithmState.INITIAL,
        reset: function () {
            this.state = CommonAlgorithmState.INITIAL;
        },
        type: "table-filling",
        step: function () {
            if (this.state === CommonAlgorithmState.INITIAL) {
                this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED;
            } else if (
                this.state === TableFillingAlgorithmState.ALL_PAIRS_MARKED
            ) {
                this.state = CommonAlgorithmState.FINAL;
            }
        },
    };
    const stepBackwardCallback = jest.fn();
    const stepForwardCallback = jest.fn();
    const wrapper = shallow(
        <AlgorithmStepControls
            algorithm={algorithm}
            stepBackwardCallback={stepBackwardCallback}
            stepForwardCallback={stepForwardCallback}
        />
    );
    let resetButton = wrapper.find("button").at(0);
    let stepBackwardButton = wrapper.find("button").at(1);
    let stepForwardButton = wrapper.find("button").at(2);
    let skipButton = wrapper.find("button").at(3);
    expect(resetButton.get(0).props.disabled).toBe(true)
    expect(stepBackwardButton.get(0).props.disabled).toBe(true)
    expect(stepForwardButton.get(0).props.disabled).toBe(false)
    expect(skipButton.get(0).props.disabled).toBe(false)

    stepForwardButton.simulate("click");
    wrapper.setProps({})
    resetButton = wrapper.find("button").at(0);
    expect(resetButton.get(0).props.disabled).toBe(false)

    stepForwardButton.simulate("click");
    wrapper.setProps({})
    stepForwardButton = wrapper.find("button").at(2);
    skipButton = wrapper.find("button").at(3);
    expect(stepForwardButton.get(0).props.disabled).toBe(true)
    expect(skipButton.get(0).props.disabled).toBe(true)
});
