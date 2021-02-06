import {shallow} from "enzyme";
import {Algorithm, CommonAlgorithmState} from "../../types/Algorithm";
import AlgorithmLog from "./AlgorithmLog";

it('renders messages logged by algorithm', function () {
    const algorithm: Algorithm = {
        state: CommonAlgorithmState.INITIAL,
        reset: () => {},
        type: "table-filling",
        step: () => {}
    };

    const wrapper = shallow(<AlgorithmLog algorithm={algorithm}/>);
    algorithm.log!.log("Test message");
    expect(wrapper.text().includes("Test message")).toBe(true)
});

it('does not render cleared messages', function () {
    const algorithm: Algorithm = {
        state: CommonAlgorithmState.INITIAL,
        reset: () => {},
        type: "table-filling",
        step: () => {}
    };

    const wrapper = shallow(<AlgorithmLog algorithm={algorithm}/>);
    algorithm.log!.log("Test message");
    expect(wrapper.text().includes("Test message")).toBe(true)
    algorithm.log!.clear();
    expect(wrapper.text().includes("Test message")).toBe(false)
});