import { mount, shallow } from "enzyme";
import TransitionsInput from "./TransitionsInput";

it("detects invalid transitions", function () {
    const transitions = new Map();
    let valid = true;
    transitions.set("q1", new Map());
    transitions.get("q1").set("0", "q");
    const wrapper = mount(
        <TransitionsInput
            states={["q1"]}
            alphabet={["0"]}
            transitions={transitions}
            setTransition={(from, symbol, to) =>
                transitions.get(from)!.set(symbol, to)
            }
            setTransitionsValid={(result) => {
                valid = result;
            }}
        />
    );
    expect(valid).toBe(false);
});

it("creates transitions on input", function () {
    const transitions = new Map();
    let valid = true;
    transitions.set("q1", new Map());
    transitions.get("q1").set("0", "q");
    const wrapper = mount(
        <TransitionsInput
            states={["q1"]}
            alphabet={["0"]}
            transitions={transitions}
            setTransition={(from, symbol, to) => {
                transitions.get(from)!.set(symbol, to);
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
    expect(transitions).toEqual(new Map([["q1", new Map([["0", "q1"]])]]));
});
