import { mount, shallow } from "enzyme";
import { AlgorithmMode } from "../../../types/Algorithm";
import AlgorithmPicker from "./AlgorithmPicker";

it("checkboxes rendered correctly and work for selecting algorithms", function () {
    let algorithmsSelected = {
        tableFilling: false,
        tableFillingWitness: false,
        hopcroft: false,
        hopcroftWitness: false,
        nearlyLinear: false,
        nearlyLinearWitness: false,
    };
    let wrapper = mount(
        <AlgorithmPicker
            mode={AlgorithmMode.EQUIVALENCE_TESTING}
            algorithmsSelected={algorithmsSelected}
            setAlgorithmsSelected={(a) => (algorithmsSelected = a)}
        />
    );
    let checkBoxes = wrapper.find("input");
    expect(checkBoxes.length).toBe(6);
    expect(checkBoxes.every((c) => c.props().checked)).toBe(false);
    expect(checkBoxes.map((c) => c.props().disabled).filter((c) => !c).length).toBe(5);
    algorithmsSelected.tableFilling = true;
    algorithmsSelected.hopcroft = true;
    wrapper.setProps({ algorithmsSelected });
    checkBoxes = wrapper.find("input");
    expect(checkBoxes.map((c) => c.props().checked).filter((b) => b).length).toBe(2);
    checkBoxes.at(0).simulate("change"); // table-filling -> false
    wrapper.setProps({ algorithmsSelected });
    checkBoxes.at(1).simulate("change"); // table-filling witness -> true
    wrapper.setProps({ algorithmsSelected });
    checkBoxes.at(2).simulate("change"); // hopcroft -> false
    wrapper.setProps({ algorithmsSelected });
    checkBoxes.at(3).simulate("change"); // hopcroft witness -> true
    wrapper.setProps({ algorithmsSelected });
    checkBoxes.at(4).simulate("change"); // nearly linear -> true
    expect(algorithmsSelected).toEqual({
        tableFilling: false,
        tableFillingWitness: true,
        hopcroft: false,
        hopcroftWitness: true,
        nearlyLinear: true,
        nearlyLinearWitness: false,
    });
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
    expect(checkBoxes.find('input[name="tableFilling"]').props().disabled).toBe(false);
    expect(checkBoxes.find('input[name="tableFillingWitness"]').props().disabled).toBe(true);
    expect(checkBoxes.find('input[name="hopcroft"]').props().disabled).toBe(false);
    expect(checkBoxes.find('input[name="hopcroftWitness"]').props().disabled).toBe(true);
    expect(checkBoxes.find('input[name="nearlyLinear"]').props().disabled).toBe(false);
    expect(checkBoxes.find('input[name="nearlyLinearWitness"]').props().disabled).toBe(true);
});
