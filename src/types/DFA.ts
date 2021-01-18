export interface DFA {
    states: State[],
    startingState: State
    finalStates: Set<State>,
    alphabet: string[]
}

type Transitions = Map<string, State>

export interface State {
    name: string,
    transitions: Transitions
}