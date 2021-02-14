import { DFA, State, Transitions } from "../types/DFA";

const combineStates = (dfa: DFA, statesToBeCombined: State[][]): DFA => {
    const oldStateToCombinedState: Map<State, State[]> = mapStateToCombinedStates(
        dfa,
        statesToBeCombined
    );
    const oldStateToNewState: Map<State, State> = new Map<State, State>();
    const newStateToRepresentative: Map<State, State> = new Map<State, State>();
    const newStates: State[] = [];

    for (let statesBeingCombined of new Set(oldStateToCombinedState.values())) {
        // initialize new State instances for each State[] that is combined
        const newStateName =
            statesBeingCombined.length === 1
                ? statesBeingCombined[0].name
                : "{" + statesBeingCombined.map((s) => s.name).join(",") + "}";
        const combinedState = {
            name: newStateName,
            transitions: new Map<string, State>(),
        };
        const representative = statesBeingCombined[0];
        newStateToRepresentative.set(combinedState, representative);
        newStates.push(combinedState);
        for (let state of statesBeingCombined) {
            oldStateToNewState.set(state, combinedState);
        }
    }

    for (let newState of newStates) {
        // fill in transitions for each new State
        const representative = newStateToRepresentative.get(newState)!;
        const newTransitions: Transitions = new Map<string, State>();
        for (let symbol of dfa.alphabet) {
            newTransitions.set(
                symbol,
                oldStateToNewState.get(representative.transitions.get(symbol)!)!
            );
        }
        newState.transitions = newTransitions;
    }

    const startingState = oldStateToNewState.get(dfa.startingState)!;
    const finalStates = new Set(
        Array.from(dfa.finalStates).map((finalState) => oldStateToNewState.get(finalState)!)
    );
    return {
        finalStates,
        startingState,
        states: newStates,
        alphabet: dfa.alphabet,
    };
};

const mapStateToCombinedStates = (dfa: DFA, statesToBeCombined: State[][]) => {
    const stateToCombinedStateMap = new Map<State, State[]>();
    for (let state of dfa.states) {
        stateToCombinedStateMap.set(state, [state]); // initially map each old state to itself
    }
    for (let combinedState of statesToBeCombined) {
        for (let state of combinedState) {
            stateToCombinedStateMap.set(state, combinedState); // override entry if old state needs to be combined
        }
    }
    return stateToCombinedStateMap;
};

const minimizer = {
    combineStates,
};
export default minimizer;
