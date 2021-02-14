import { DFA, State } from "../types/DFA";
import { dfaA } from "./data";
import minimizer from "./Minimizer";
import _ from "lodash";

it("creates identical DFA when no states are combined", function () {
    const inputClone = _.clone(dfaA);
    const result = minimizer.combineStates(dfaA, []);
    expect(result).toEqual(dfaA);
    expect(inputClone).toEqual(dfaA);
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
