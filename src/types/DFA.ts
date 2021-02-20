export interface DFA {
    states: State[];
    startingState: State;
    finalStates: Set<State>;
    alphabet: string[];
}

export type Transitions = Map<string, State>;

export interface State {
    name: string;
    transitions: Transitions;
}

export interface SerializedDfa {
    states: string[];
    transitions: [string, string, string][]; // fromState, symbol, toState
    startingState: string;
    finalStates: string[];
    alphabet: string[];
}
