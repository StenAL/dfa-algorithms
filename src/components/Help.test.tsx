import { shallow } from "enzyme";
import Help from "./Help";

it("renders without crashing", function () {
    const wrapper = shallow(<Help />);
    expect(wrapper.exists()).toBe(true);
});
