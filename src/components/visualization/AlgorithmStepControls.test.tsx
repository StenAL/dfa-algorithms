import { shallow } from "enzyme";
import { TableFillingAlgorithmState } from "../../algorithm/TableFillingAlgorithm";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
} from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import AlgorithmStepControls from "./AlgorithmStepControls";

it("buttons call corresponding algorithm functions and invoke callback", function () {
    const algorithm: Algorithm = {
        input1: {} as DFA,
        mode: AlgorithmMode.EQUIVALENCE_TESTING,
        result: EquivalenceTestingResult.NOT_AVAILABLE,
        state: CommonAlgorithmState.INITIAL,
        reset: function () {
            this.state = CommonAlgorithmState.INITIAL;
        },
        type: "tableFilling",
        step: function () {
            if (this.state === CommonAlgorithmState.INITIAL) {
                this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED;
            } else if (this.state === TableFillingAlgorithmState.ALL_PAIRS_MARKED) {
                this.state = CommonAlgorithmState.FINAL;
            }
        },
        witness: "",
        produceWitness: false,
        run: function () {
            while (this.state !== CommonAlgorithmState.FINAL) {
                this.step();
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

    let resetButton = wrapper.find("button").at(0);
    resetButton.simulate("click");
    expect(stepBackwardCallback).toHaveBeenCalledTimes(1);
    expect(algorithm.state).toBe(CommonAlgorithmState.INITIAL);
    let skipButton = wrapper.find("button").at(3);
    skipButton.simulate("click");
    expect(stepForwardCallback).toHaveBeenCalledTimes(3);
    expect(algorithm.state).toBe(CommonAlgorithmState.FINAL);
});

it("disables invalid step buttons", function () {
    const algorithm: Algorithm = {
        input1: {} as DFA,
        mode: AlgorithmMode.EQUIVALENCE_TESTING,
        result: EquivalenceTestingResult.NOT_AVAILABLE,
        state: CommonAlgorithmState.INITIAL,
        reset: function () {
            this.state = CommonAlgorithmState.INITIAL;
        },
        type: "tableFilling",
        step: function () {
            if (this.state === CommonAlgorithmState.INITIAL) {
                this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED;
            } else if (this.state === TableFillingAlgorithmState.ALL_PAIRS_MARKED) {
                this.state = CommonAlgorithmState.FINAL;
            }
        },
        witness: "",
        produceWitness: false,
        run: function () {
            while (this.state !== CommonAlgorithmState.FINAL) {
                this.step();
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
    expect(resetButton.get(0).props.disabled).toBe(true);
    expect(stepBackwardButton.get(0).props.disabled).toBe(true);
    expect(stepForwardButton.get(0).props.disabled).toBe(false);
    expect(skipButton.get(0).props.disabled).toBe(false);

    stepForwardButton.simulate("click");
    wrapper.setProps({});
    resetButton = wrapper.find("button").at(0);
    expect(resetButton.get(0).props.disabled).toBe(false);

    stepForwardButton.simulate("click");
    wrapper.setProps({});
    stepForwardButton = wrapper.find("button").at(2);
    skipButton = wrapper.find("button").at(3);
    expect(stepForwardButton.get(0).props.disabled).toBe(true);
    expect(skipButton.get(0).props.disabled).toBe(true);
});
