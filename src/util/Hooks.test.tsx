import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { useForceUpdate } from "./Hooks";

let data = 0;
beforeEach(() => {
    data = 0;
});

interface TestObject {
    forceUpdate?: () => void;
}

const Component = ({ testObject }: { testObject: TestObject }) => {
    testObject.forceUpdate = useForceUpdate();
    return <div>{data}</div>;
};

it("forces rerender with new data", () => {
    const testObject: TestObject = {};
    const wrapper = mount(<Component testObject={testObject} />);
    expect(wrapper.find("div").text()).toBe("0");
    data = 1;
    act(() => {
        testObject.forceUpdate!();
    });
    expect(wrapper.find("div").text()).toBe("1");
});
