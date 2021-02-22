import { shallow } from "enzyme";
import { DatasetType } from "../../types/Dataset";
import DatasetModeSelect from "./DatasetModeSelect";

it("generates option for every possible DatasetType", function () {
    const callback = jest.fn();
    const wrapper = shallow(
        <DatasetModeSelect
            statePrefix={"q"}
            generationMode={DatasetType.RANDOM}
            callback={callback}
        />
    );
    const inputs = wrapper.find("input");
    expect(inputs.length).toBe(Object.keys(DatasetType).length / 2);
    expect(inputs.at(0).props().checked).toBe(true);
    inputs.at(1).simulate("change");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(DatasetType.PLACEHOLDER);
});
