import { mount } from "enzyme";
import { DFA, State } from "../../types/DFA";
import InputConverter from "./InputConverter";

it("does not convert invalid input", function () {
    const callbackMock = jest.fn();
    mount(
        <InputConverter
            states={["q1", "q2"]}
            transitions={
                new Map([
                    [
                        "q1",
                        new Map([
                            ["0", "q2"],
                            ["1", "q2"],
                        ]),
                    ],
                    [
                        "q2",
                        new Map([
                            ["0", "q2"],
                            ["1", "q2"],
                        ]),
                    ],
                ])
            }
            finalStates={["q1"]}
            alphabet={["0", "1"]}
            validInput={false}
            convertInputCallback={callbackMock}
        />
    );
    expect(callbackMock).toHaveBeenLastCalledWith(undefined);
});

it("correctly converts valid input", function () {
    const callbackMock = jest.fn();
    mount(
        <InputConverter
            states={["q1", "q2"]}
            transitions={
                new Map([
                    [
                        "q1",
                        new Map([
                            ["0", "q2"],
                            ["1", "q2"],
                        ]),
                    ],
                    [
                        "q2",
                        new Map([
                            ["0", "q2"],
                            ["1", "q2"],
                        ]),
                    ],
                ])
            }
            finalStates={["q1"]}
            alphabet={["0", "1"]}
            validInput={true}
            convertInputCallback={callbackMock}
        />
    );

    const q1: State = {
        name: "q1",
        transitions: new Map(),
    };
    const q2: State = {
        name: "q2",
        transitions: new Map(),
    };
    q1.transitions.set("0", q2);
    q1.transitions.set("1", q2);
    q2.transitions.set("0", q2);
    q2.transitions.set("1", q2);
    const expectedDfa: DFA = {
        states: [q1, q2],
        finalStates: new Set<State>([q1]),
        alphabet: ["0", "1"],
        startingState: q1,
    };
    expect(callbackMock).toHaveBeenLastCalledWith(expectedDfa);
});
