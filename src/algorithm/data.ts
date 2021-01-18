import {DFA, State} from "../types/DFA";
import TableFillingAlgorithm from "./TableFillingAlgorithm";

const alphabet = ["0", "1"]

const q0: State = {
    name: "q0",
    transitions: new Map()
}

const q1: State = {
    name: "q1",
    transitions: new Map()
}

const q2: State = {
    name: "q2",
    transitions: new Map()
}

const q3: State = {
    name: "q3",
    transitions: new Map()
}

q0.transitions.set("0", q1)
q0.transitions.set("1", q3)
q1.transitions.set("0", q3)
q1.transitions.set("1", q2)
q2.transitions.set("0", q3)
q2.transitions.set("1", q2)
q3.transitions.set("0", q3)
q3.transitions.set("1", q3)

export const dfaA: DFA = {
    alphabet: alphabet, finalStates: [q2], startingState: q0, states: [q0, q1, q2, q3]
}

const q4: State = {
    name: "q4",
    transitions: new Map()
}

const q5: State = {
    name: "q5",
    transitions: new Map()
}

const q6: State = {
    name: "q6",
    transitions: new Map()
}

const q7: State = {
    name: "q7",
    transitions: new Map()
}

q4.transitions.set("0", q5)
q4.transitions.set("1", q7)
q5.transitions.set("0", q7)
q5.transitions.set("1", q6)
q6.transitions.set("0", q7)
q6.transitions.set("1", q7)
q7.transitions.set("0", q7)
q7.transitions.set("1", q7)

export const dfaB: DFA = {
    alphabet: alphabet, finalStates: [q6], startingState: q4, states: [q4, q5, q6, q7]
}

const algo = new TableFillingAlgorithm(dfaA, dfaB)
algo.step()