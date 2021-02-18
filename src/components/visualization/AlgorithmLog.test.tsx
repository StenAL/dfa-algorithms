import { shallow } from "enzyme";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
} from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import AlgorithmLog from "./AlgorithmLog";

it("renders messages logged by algorithm", function () {
    const algorithm: Algorithm = {
        input1: {} as DFA,
        mode: AlgorithmMode.EQUIVALENCE_TESTING,
        result: EquivalenceTestingResult.NOT_AVAILABLE,
        state: CommonAlgorithmState.INITIAL,
        reset: () => {},
        type: "tableFilling",
        step: () => {},
        produceWitness: false,
        witness: "",
        run: jest.fn(),
    };

    const wrapper = shallow(<AlgorithmLog algorithm={algorithm} />);
    algorithm.log!.log("Test message");
    expect(wrapper.text().includes("Test message")).toBe(true);
});

it("does not render cleared messages", function () {
    const algorithm: Algorithm = {
        input1: {} as DFA,
        mode: AlgorithmMode.EQUIVALENCE_TESTING,
        result: EquivalenceTestingResult.NOT_AVAILABLE,
        state: CommonAlgorithmState.INITIAL,
        reset: () => {},
        type: "tableFilling",
        step: () => {},
        produceWitness: false,
        witness: "",
        run: jest.fn(),
    };

    const wrapper = shallow(<AlgorithmLog algorithm={algorithm} />);
    algorithm.log!.log("Test message");
    expect(wrapper.text().includes("Test message")).toBe(true);
    algorithm.log!.clear();
    expect(wrapper.text().includes("Test message")).toBe(false);
});
