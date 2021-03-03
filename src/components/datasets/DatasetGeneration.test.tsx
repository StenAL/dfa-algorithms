import { mount } from "enzyme";
import DatasetGeneration from "./DatasetGeneration";
import DatasetGenerator from "./DatasetGenerator";

it("renders and validates only 1 dfa in STATE_MINIMIZATION mode", function () {
    const wrapper = mount(<DatasetGeneration />);
    const modeSwitch = wrapper.find('input[role="switch"]');
    modeSwitch.simulate("change");
    wrapper.setProps({});
    expect(wrapper.find(DatasetGenerator).length).toBe(1);
});
