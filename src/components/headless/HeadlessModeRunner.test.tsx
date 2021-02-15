import { shallow } from "enzyme";
import { TableFillingAlgorithmState } from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, CommonAlgorithmState } from "../../types/Algorithm";
import HeadlessModeRunner from "./HeadlessModeRunner";

it("runs all algorithms passed", function () {
    const runMock = jest.fn();
    const algorithm: Algorithm = {
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
        run: runMock,
    };
    const wrapper = shallow(<HeadlessModeRunner algorithms={[algorithm, algorithm]} />);
    const runButton = wrapper.find("button");
    runButton.simulate("click");
    expect(runMock).toHaveBeenCalledTimes(2);
});
