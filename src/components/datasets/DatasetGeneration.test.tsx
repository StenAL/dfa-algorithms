import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { exampleDfa1 } from "../../algorithm/data/exampleData";
import DatasetGeneration from "./DatasetGeneration";
import DatasetGenerator from "./DatasetGenerator";

it("validates input", function () {
    const wrapper = mount(<DatasetGeneration />);
    let downloadButton = wrapper.find("button");
    downloadButton = downloadButton.at(downloadButton.length - 1);
    expect(downloadButton.text()).toContain("Download");
    expect(downloadButton.props().disabled).toBe(true);

    const dfaGenerator1 = wrapper.find(DatasetGenerator).at(0);
    act(() => {
        dfaGenerator1.props().callback(exampleDfa1);
    });
    const dfaGenerator2 = wrapper.find(DatasetGenerator).at(1);
    act(() => {
        dfaGenerator2.props().callback(exampleDfa1);
    });

    wrapper.setProps({});
    downloadButton = wrapper.find("button");
    downloadButton = downloadButton.at(downloadButton.length - 1);
    expect(downloadButton.text()).toContain("Download");
    expect(downloadButton.props().disabled).toBe(false);
});

it("renders and validates only 1 dfa in STATE_MINIMIZATION mode", function () {
    const wrapper = mount(<DatasetGeneration />);
    const modeSwitch = wrapper.find('input[role="switch"]');
    modeSwitch.simulate("change");
    wrapper.setProps({});
    expect(wrapper.find(DatasetGenerator).length).toBe(1);
    const dfaGenerator = wrapper.find(DatasetGenerator).at(0);
    act(() => {
        dfaGenerator.props().callback(exampleDfa1);
    });

    wrapper.setProps({});
    let downloadButton = wrapper.find("button");
    downloadButton = downloadButton.at(downloadButton.length - 1);
    expect(downloadButton.text()).toContain("Download");
    expect(downloadButton.props().disabled).toBe(false);
});
