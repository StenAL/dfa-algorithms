import { shallow } from "enzyme";
import React from "react";
import AlphabetInput from "./AlphabetInput";

it("validates alphabet", function () {
    const callback = jest.fn();
    const wrapper = shallow(<AlphabetInput alphabet={["1", "1"]} callback={callback} />);
    let alphabetInput = wrapper.find('input[name="alphabet"]');
    expect(alphabetInput.hasClass("invalid-input")).toBe(true);
    alphabetInput.simulate("change", { target: { value: "0,1" } });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(["0", "1"]);
    wrapper.setProps({ alphabet: ["0", "1"] });

    alphabetInput = wrapper.find('input[name="alphabet"]');
    expect(alphabetInput.hasClass("invalid-input")).toBe(false);
});

it("ignores trailing comma", function () {
    const callback = jest.fn();
    const wrapper = shallow(<AlphabetInput alphabet={[]} callback={callback} />);
    let alphabetInput = wrapper.find('input[name="alphabet"]');

    alphabetInput.simulate("change", { target: { value: "0,1" } });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(["0", "1"]);

    alphabetInput.simulate("change", { target: { value: "0,1," } });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(["0", "1"]);
});
