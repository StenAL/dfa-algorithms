import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGeneration from "./DatasetGeneration";
import DatasetGenerator from "./DatasetGenerator";

it("passes alphabet and state prefix to generator", function () {
    const wrapper = mount(
        <MemoryRouter>
            <DatasetGeneration />
        </MemoryRouter>
    );
    const alphabetInput = wrapper.find(AlphabetInput);
    act(() => alphabetInput.props().callback(["a", "b"]));
    wrapper.setProps({});
    expect(wrapper.find(DatasetGenerator).length).toBe(2);
    expect(wrapper.find(DatasetGenerator).at(0).props().alphabet).toEqual(["a", "b"]);
    expect(wrapper.find(DatasetGenerator).at(0).props().statePrefix).toEqual("q");
    expect(wrapper.find(DatasetGenerator).at(1).props().statePrefix).toEqual("p");
});
