import noam from "noam";
import { AlgorithmUrlString } from "../components/visualization/AlgorithmVisualization";
import { AlgorithmMode, AlgorithmType } from "../types/Algorithm";
import { DatasetType, PreGeneratedDatasetName } from "../types/Dataset";
import { DFA, SerializedDfa, State } from "../types/DFA";

export function getAlgorithmName(type: AlgorithmType | AlgorithmUrlString) {
    switch (type) {
        case "tableFilling":
        case "table-filling":
            return "Table-Filling Algorithm";
        case "tableFillingWitness":
            return "Table-Filling Algorithm (Witness)";
        case "hopcroft":
            return "n-lg-n Hopcroft Algorithm";
        case "hopcroftWitness":
            return "n-lg-n Hopcroft Algorithm (Witness)";
        case "nearly-linear":
        case "nearlyLinear":
            return "(Nearly) Linear Algorithm";
        case "nearlyLinearWitness":
            return "(Nearly) Linear Algorithm (Witness)";
    }
}

export function getDatasetTypeName(type: DatasetType): string {
    switch (type) {
        case DatasetType.RANDOM:
            return "Random";
        case DatasetType.SPRAWLING:
            return "Sprawling";
        case DatasetType.LINEAR:
            return "Linear";
    }
}

export function getDatasetTypeDescription(type: DatasetType) {
    switch (type) {
        case DatasetType.RANDOM:
            return (
                "Random datasets consist of DFAs where transitions and final states are allocated randomly. The DFA " +
                "might or might not contain cycles, the only thing that is guaranteed is that all states in the DFA are connected."
            );
        case DatasetType.SPRAWLING:
            return (
                "Sprawling datasets create transitions that form a full n-ary tree, where n is the length of the " +
                "DFA's alphabet. Accepting states are assigned to be at the furthest points from the starting state " +
                "using BFS. Sprawling datasets induce worst-case performance in The (Nearly) Linear Algorithm."
            );
        case DatasetType.LINEAR:
            return (
                "Linear datasets are DFAs in which the transition graph forms a straight line. Each state will only have " +
                "transitions going to it from the previous state and will only transition to the next state. Final " +
                "states are assigned to be at the end of the chain. Linear datasets induce worst-case performance in The Table-Filling Algorithm"
            );
    }
}

export function getPreGeneratedDatasetPrintName(type: PreGeneratedDatasetName): string {
    switch (type) {
        case "example":
            return "Example inputs";
        case "random":
            return "Randomly-connected";
        case "sprawling":
            return "Sprawling tree";
        case "linear":
            return "Linear";
    }
}

export function getAlgorithmModes(type: AlgorithmType | AlgorithmUrlString) {
    switch (type) {
        case "table-filling":
        case "tableFilling":
            return [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
        case "tableFillingWitness":
            return [AlgorithmMode.EQUIVALENCE_TESTING];
        case "hopcroft":
            return [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
        case "hopcroftWitness":
            return [AlgorithmMode.EQUIVALENCE_TESTING];
        case "nearly-linear":
        case "nearlyLinear":
        case "nearlyLinearWitness":
            return [AlgorithmMode.EQUIVALENCE_TESTING];
    }
}

export const serializeDfa = (dfa: DFA): SerializedDfa => {
    const states = dfa.states.map((s) => s.name);
    const transitions = dfa.states
        .map((s) =>
            Array.from(s.transitions.entries()).map(([symbol, to]) => [s.name, symbol, to.name])
        )
        .flat() as [string, string, string][];
    const finalStates = Array.from(dfa.finalStates).map((s) => s.name);
    const startingState = dfa.startingState.name;
    return {
        states,
        transitions,
        finalStates,
        startingState,
        alphabet: dfa.alphabet,
    };
};

export const deserializeDfa = (data: SerializedDfa): DFA => {
    const states: State[] = data.states.map((name) => ({
        name,
        transitions: new Map<string, State>(),
    }));
    const nameToState = new Map<string, State>(states.map((s) => [s.name, s]));
    data.transitions.forEach(([from, symbol, to]) =>
        nameToState.get(from)!.transitions.set(symbol, nameToState.get(to)!)
    );
    const finalStates = new Set<State>(data.finalStates.map((name) => nameToState.get(name)!));
    const startingState = nameToState.get(data.startingState)!;
    return { states, startingState, finalStates, alphabet: data.alphabet };
};

export const getPrettyDfaString = (dfa: DFA): string[] => {
    const messages: string[] = [];
    messages.push(
        `States: ${dfa.states.length}, final states: {${Array.from(dfa.finalStates)
            .map((s) => s.name)
            .join(", ")}}. Alphabet: {${dfa.alphabet.join(", ")}}`
    );
    messages.push("Transitions");
    for (let from of dfa.states) {
        for (let symbol of dfa.alphabet) {
            messages.push(`(${from.name}, ${symbol}): ${from.transitions.get(symbol)!.name}`);
        }
    }
    return messages;
};

export function dfaToNoamInput(dfa: DFA) {
    const output: string[] = [];
    output.push("#states");
    dfa.states.forEach((s) => output.push(s.name));
    output.push("#initial");
    output.push(dfa.startingState.name);
    output.push("#accepting");
    dfa.finalStates.forEach((s) => output.push(s.name));
    output.push("#alphabet");
    dfa.alphabet.forEach((s) => output.push(s));
    output.push("#transitions");
    for (let state of dfa.states) {
        for (let symbol of dfa.alphabet) {
            output.push(`${state.name}:${symbol}>${state.transitions.get(symbol)!.name}`);
        }
    }
    const automatonString = output.join("\n");
    const automaton = noam.fsm.parseFsmFromString(automatonString);
    const dotString = noam.fsm.printDotFormat(automaton) as string;
    return dotString;
}
