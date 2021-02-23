import { shallow } from "enzyme";
import { TableFillingAlgorithmState } from "../../algorithm/TableFillingAlgorithm";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
} from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import HeadlessModeRunner from "./HeadlessModeRunner";

it("resets and runs all algorithms passed as parameters", function () {
    const resetMock = jest.fn();
    const runMock = jest.fn();
    const algorithm: Algorithm = {
        input1: {} as DFA,
        mode: AlgorithmMode.EQUIVALENCE_TESTING,
        result: EquivalenceTestingResult.NOT_AVAILABLE,
        state: CommonAlgorithmState.INITIAL,
        reset: resetMock,
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
        run: runMock,
    };
    const wrapper = shallow(<HeadlessModeRunner algorithms={[algorithm, algorithm]} />);
    const runButton = wrapper.find("button");
    runButton.simulate("click");
    expect(resetMock).toHaveBeenCalledTimes(2);
    expect(runMock).toHaveBeenCalledTimes(2);
});

it("reports back results", function () {
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
        produceWitness: true,
        run: function () {
            this.result = EquivalenceTestingResult.NON_EQUIVALENT;
            this.witness = "1001";
        },
    };
    const wrapper = shallow(<HeadlessModeRunner algorithms={[algorithm]} />);
    const runButton = wrapper.find("button");
    runButton.simulate("click");
    wrapper.setProps({});
    expect(wrapper.text()).toContain("Not Equivalent");
    expect(wrapper.text()).toContain("1001");
});
