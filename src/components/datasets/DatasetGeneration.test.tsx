import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGeneration from "./DatasetGeneration";
import DatasetGenerator from "./DatasetGenerator";

it("passes alphabet to generator", function () {
    const wrapper = mount(<DatasetGeneration />);
    const alphabetInput = wrapper.find(AlphabetInput);
    act(() => alphabetInput.props().callback(["a", "b"]));
    wrapper.setProps({});
    expect(wrapper.find(DatasetGenerator).length).toBe(1);
    expect(wrapper.find(DatasetGenerator).props().alphabet).toEqual(["a", "b"]);
});
