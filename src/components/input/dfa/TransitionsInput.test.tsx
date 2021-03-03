import { mount } from "enzyme";
import HashMap from "hashmap";
import TransitionsInput from "./TransitionsInput";

it("detects invalid transitions", function () {
    const transitions = new HashMap<[string, string], string>([[["q1", "0"], "q"]]);
    let valid = true;
    mount(
        <TransitionsInput
            states={["q1"]}
            alphabet={["0"]}
            transitions={transitions}
            setTransition={(from, symbol, to) => {
                transitions.set([from, symbol], to);
            }}
            setTransitionsValid={(result) => {
                valid = result;
            }}
        />
    );
    expect(valid).toBe(false);
});

it("creates transitions on input", function () {
    const transitions = new HashMap<[string, string], string>([[["q1", "0"], "q"]]);
    let valid = true;
    const wrapper = mount(
        <TransitionsInput
            states={["q1"]}
            alphabet={["0"]}
            transitions={transitions}
            setTransition={(from, symbol, to) => {
                transitions.set([from, symbol], to);
            }}
            setTransitionsValid={(result) => {
                valid = result;
            }}
        />
    );
    expect(valid).toBe(false);
    let transitionInput = wrapper.find("input");
    transitionInput.simulate("change", { target: { value: "q1" } });
    wrapper.setProps({}); // re-render
    expect(valid).toBe(true);
    expect(transitions).toEqual(new HashMap([[["q1", "0"], "q1"]]));
});
