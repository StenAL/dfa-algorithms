import { shallow } from "enzyme";
import MainPage from "./MainPage";

it("renders without crashing", function () {
    const wrapper = shallow(<MainPage />);
    expect(wrapper.exists()).toBe(true);
});
