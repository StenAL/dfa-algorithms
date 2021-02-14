import { shallow } from "enzyme";
import { AlgorithmMode } from "../../types/Algorithm";
import AlgorithmPicker from "./AlgorithmPicker";

it("renders checkboxes correctly for selected algorithms", function () {
    let algorithmsSelected = {
        nearlyLinear: false,
        hopcroft: false,
        hopcroftWitness: false,
        nearlyLinearWitness: false,
        tableFilling: false,
        tableFillingWitness: false,
    };
    const wrapper = shallow(
        <AlgorithmPicker
            mode={AlgorithmMode.EQUIVALENCE_TESTING}
            algorithmsSelected={algorithmsSelected}
            setAlgorithmsSelected={(a) => (algorithmsSelected = a)}
        />
    );
    let checkBoxes = wrapper.find("input");
    expect(checkBoxes.length).toBe(6);
    expect(checkBoxes.every((c) => c.props().checked)).toBe(false);
    // expect(checkBoxes.every(c => c.props().disabled)).toBe(false) todo uncomment when all algorithms are implemented
    algorithmsSelected.tableFilling = true;
    wrapper.setProps({ algorithmsSelected });
    checkBoxes = wrapper.find("input");
    expect(checkBoxes.map((c) => c.props().checked).filter((b) => b).length).toBe(1);
});

it("disables algorithms not available in STATE_MINIMIZATION mode", function () {
    let algorithmsSelected = {
        nearlyLinear: false,
        hopcroft: false,
        hopcroftWitness: false,
        nearlyLinearWitness: false,
        tableFilling: false,
        tableFillingWitness: false,
    };
    const wrapper = shallow(
        <AlgorithmPicker
            mode={AlgorithmMode.STATE_MINIMIZATION}
            algorithmsSelected={algorithmsSelected}
            setAlgorithmsSelected={(a) => (algorithmsSelected = a)}
        />
    );
    let checkBoxes = wrapper.find("input");
    expect(checkBoxes.find('input[name="table-filling"]').props().disabled).toBe(undefined);
    expect(checkBoxes.find('input[name="table-filling-witness"]').props().disabled).toBe(true);
    // expect(checkBoxes.find('input[name="hopcroft"]').props().disabled).toBe(undefined) // todo uncomment once implemented
    expect(checkBoxes.find('input[name="hopcroft-witness"]').props().disabled).toBe(true);
    // expect(checkBoxes.find('input[name="nearly-linear"]').props().disabled).toBe(undefined)
    expect(checkBoxes.find('input[name="nearly-linear-witness"]').props().disabled).toBe(true);
});
