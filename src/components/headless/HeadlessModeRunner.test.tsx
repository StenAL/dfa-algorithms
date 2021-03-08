import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { exampleDfa1, exampleDfa2 } from "../../algorithm/data/exampleData";
import { TableFillingAlgorithmState } from "../../algorithm/TableFillingAlgorithm";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
} from "../../types/Algorithm";
import HeadlessModeRunner from "./HeadlessModeRunner";

it("resets and runs all algorithms passed as parameters", function () {
    const resetMock = jest.fn();
    const runMock = jest.fn();
    const algorithm: Algorithm = {
        input1: exampleDfa1,
        input2: exampleDfa1,
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
    const runButton = wrapper
        .find("button")
        .findWhere((b) => b.text() === "Start")
        .at(0);
    runButton.simulate("click");
    expect(resetMock).toHaveBeenCalledTimes(2);
    expect(runMock).toHaveBeenCalledTimes(2);
});

it("reports back equivalence testing results", function () {
    const algorithm: Algorithm = {
        input1: exampleDfa1,
        input2: exampleDfa1,
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
    const runButton = wrapper
        .find("button")
        .findWhere((b) => b.text() === "Start")
        .at(0);
    runButton.simulate("click");
    wrapper.setProps({});
    expect(wrapper.text()).toContain("Not Equivalent");
    expect(wrapper.text()).toContain("1001");
});

it("reports back state minimization results", function () {
    const algorithm: Algorithm = {
        input1: exampleDfa1,
        mode: AlgorithmMode.STATE_MINIMIZATION,
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
            this.result = exampleDfa2;
        },
    };
    const wrapper = mount(
        <MemoryRouter>
            <HeadlessModeRunner algorithms={[algorithm]} />
        </MemoryRouter>
    );
    const runButton = wrapper
        .find("button")
        .findWhere((b) => b.text() === "Start")
        .at(0);
    runButton.simulate("click");
    wrapper.setProps({});
    expect(wrapper.text()).toContain("Download minimized");
});
