import { AlgorithmUrlString } from "../components/visualization/AlgorithmVisualization";
import { AlgorithmMode, AlgorithmType } from "../types/Algorithm";
import { DatasetType } from "../types/Dataset";
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

export function getDatasetTypeName(type: DatasetType) {
    switch (type) {
        case DatasetType.RANDOM:
            return "Random";
        case DatasetType.SPRAWLING:
            return "Sprawling";
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
