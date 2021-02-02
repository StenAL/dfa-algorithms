import {DFA, State, Transitions} from "../../types/DFA";
import {TransitionData} from "./DfaInput";

interface InputConverterProps {
    states: string[];
    transitions: TransitionData,
    finalStates: string[],
    alphabet: string[],
    validInput: boolean;
}

export default function InputConverter({states, transitions, alphabet, finalStates, validInput} : InputConverterProps) {
    const createDfa = () => {
        const stateMap = new Map<string, State>();
        for (let state of states) {
            const partialState: Partial<State> = {};
            partialState.name = state;
            partialState.transitions = new Map<string, State>();
            stateMap.set(state, partialState as State);
        }
        for (let state of states) {
            const transitionData = transitions.get(state)!;
            const dfaTransitions: Transitions = new Map<string, State>();
            for (let entry of transitionData.entries()) {
                dfaTransitions.set(entry[0], stateMap.get(entry[1])!)
            }
            stateMap.get(state)!.transitions = dfaTransitions;
        }
        const dfaFinalStates = new Set<State>();
        for (let finalState of finalStates) {
            dfaFinalStates.add(stateMap.get(finalState)!)
        }
        const dfa : DFA = {
            startingState: stateMap.get(states[0])!,
            alphabet: alphabet,
            states: Array.from(stateMap.values()),
            finalStates: dfaFinalStates,
        }
        console.log(dfa);
    }


    return <button disabled={!validInput} onClick={() => createDfa()}>Create DFA</button>
}