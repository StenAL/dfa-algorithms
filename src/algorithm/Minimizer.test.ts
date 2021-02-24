import { DFA, State } from "../types/DFA";
import { preGeneratedDatasets } from "./data/datasets";
import { exampleDfa1 } from "./data/exampleData";
import minimizer from "./Minimizer";
import _ from "lodash";

it("creates identical DFA when no states are combined", function () {
    const inputClone = _.clone(exampleDfa1);
    const result = minimizer.combineStates(exampleDfa1, []);
    expect(result).toEqual(exampleDfa1);
    expect(inputClone).toEqual(exampleDfa1);
});

it("combines states correctly", function () {
    const q0: State = {
        name: "q0",
        transitions: new Map(),
    };

    const q1: State = {
        name: "q1",
        transitions: new Map(),
    };

    const q2: State = {
        name: "q2",
        transitions: new Map(),
    };

    const q3: State = {
        name: "q3",
        transitions: new Map(),
    };

    q0.transitions.set("0", q2);
    q0.transitions.set("1", q3);
    q1.transitions.set("0", q3);
    q1.transitions.set("1", q2);
    q2.transitions.set("0", q3);
    q2.transitions.set("1", q3);
    q3.transitions.set("0", q2);
    q3.transitions.set("1", q2);

    const dfa: DFA = {
        alphabet: ["0", "1"],
        finalStates: new Set([q2, q3]),
        startingState: q0,
        states: [q0, q1, q2, q3],
    };

    const inputClone = _.clone(dfa);
    const result = minimizer.combineStates(dfa, [
        [q0, q1],
        [q2, q3],
    ]);
    const q0q1: State = {
        name: "{q0,q1}",
        transitions: new Map(),
    };

    const q2q3: State = {
        name: "{q2,q3}",
        transitions: new Map(),
    };

    q0q1.transitions.set("0", q2q3);
    q0q1.transitions.set("1", q2q3);
    q2q3.transitions.set("0", q2q3);
    q2q3.transitions.set("1", q2q3);
    const expected: DFA = {
        states: [q0q1, q2q3],
        alphabet: ["0", "1"],
        startingState: q0q1,
        finalStates: new Set<State>([q2q3]),
    };
    expect(result).toEqual(expected);
    expect(dfa).toEqual(inputClone);
});

const states: State[] = [
    { name: "q0", transitions: new Map() },
    {
        name: "{q1,q3,q4,q5,q7,q8,q9,q10,q11,q12,q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25,q26}",
        transitions: new Map(),
    },
    { name: "q2", transitions: new Map() },
    { name: "q6", transitions: new Map() },
    { name: "q13", transitions: new Map() },
    { name: "q14", transitions: new Map() },
    { name: "{q27,q28,q29}", transitions: new Map() },
];

states[0].transitions.set("0", states[1]);
states[0].transitions.set("1", states[2]);
states[1].transitions.set("0", states[1]);
states[1].transitions.set("1", states[1]);
states[2].transitions.set("0", states[1]);
states[2].transitions.set("1", states[3]);
states[3].transitions.set("0", states[4]);
states[3].transitions.set("1", states[5]);
states[4].transitions.set("0", states[6]);
states[4].transitions.set("1", states[6]);
states[5].transitions.set("0", states[6]);
states[5].transitions.set("1", states[5]);
states[6].transitions.set("0", states[6]);
states[6].transitions.set("1", states[6]);

export const minimizedSprawling: DFA = {
    finalStates: new Set<State>([states[6]]),
    startingState: states[0],
    states: states,
    alphabet: ["0", "1"],
};

it("combines sprawling dataset correctly", function () {
    const input = preGeneratedDatasets.sprawling[0];
    const stateNamesToBeCombined = [
        "q0",
        "q1,q3,q4,q5,q7,q8,q9,q10,q11,q12,q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25,q26",
        "q2",
        "q6",
        "q13",
        "q14",
        "q27,q28,q29",
    ];
    const statesToBeCombined = stateNamesToBeCombined.map((stateNames) =>
        stateNames.split(",").map((s) => input.states.find((inputState) => inputState.name === s)!)
    );
    minimizer.combineStates(input, statesToBeCombined);
});
