import { useEffect } from "react";
import { DFA, State, Transitions } from "../../../types/DFA";
import { TransitionData } from "./StatesInput";

interface InputConverterProps {
    states: string[];
    transitions: TransitionData;
    finalStates: string[];
    alphabet: string[];
    validInput: boolean;
    convertInputCallback: (dfa: DFA | undefined) => void;
}

export default function InputConverter({
    states,
    transitions,
    alphabet,
    finalStates,
    validInput,
    convertInputCallback,
}: InputConverterProps) {
    useEffect(() => {
        if (validInput) {
            const stateMap = new Map<string, State>();
            for (let state of states) {
                const partialState: Partial<State> = {};
                partialState.name = state;
                partialState.transitions = new Map<string, State>();
                stateMap.set(state, partialState as State);
            }

            for (let [[from, symbol], to] of transitions.entries()) {
                stateMap.get(from)!.transitions.set(symbol, stateMap.get(to)!);
            }

            const dfaFinalStates = new Set<State>();
            for (let finalState of finalStates) {
                dfaFinalStates.add(stateMap.get(finalState)!);
            }
            const dfa: DFA = {
                startingState: stateMap.get(states[0])!,
                alphabet: alphabet,
                states: Array.from(stateMap.values()),
                finalStates: dfaFinalStates,
            };
            convertInputCallback(dfa);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validInput]);

    return (
        <p className={"indicator " + (validInput ? "valid-indicator" : "invalid-indicator")}>
            {validInput ? "✓" : "X"}
        </p>
    );
}
