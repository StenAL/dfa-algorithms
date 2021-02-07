import { useEffect, useState } from "react";
import { default as Tooltip } from "react-tooltip";
import { DFA } from "../../types/DFA";
import InputConverter from "./InputConverter";
import TransitionsInput from "./TransitionsInput";

export type TransitionData = Map<string, Map<string, string>>;

interface DfaInputProps {
    alphabet: string[];
    alphabetValid: boolean;
    convertInputCallback: (dfa: DFA | undefined) => void;
}

export default function DfaInput({
    convertInputCallback,
    alphabet,
    alphabetValid,
}: DfaInputProps) {
    const [states, setStates] = useState<string[]>([]);
    const [finalStates, setFinalStates] = useState<string[]>([]);
    const [transitions, setTransitions] = useState<TransitionData>(new Map());
    const [transitionsValid, setTransitionsValid] = useState<boolean>(false);
    useEffect(() => {
        const transitionsCopy: TransitionData = new Map(transitions);

        for (let state of states) {
            const t = transitionsCopy.get(state)!;
            for (let symbol of t.keys()) {
                if (!alphabet.includes(symbol)) {
                    t.delete(symbol);
                }
            }
            for (let symbol of alphabet) {
                if (!t.has(symbol)) {
                    t.set(symbol, "");
                }
            }
        }
        setTransitions(transitionsCopy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alphabet]);

    const statesValid =
        states.length > 0 && new Set(states).size === states.length;
    const finalStatesValid =
        new Set(finalStates).size === finalStates.length &&
        finalStates.every((s) => states.includes(s));

    return (
        <div className={"dfa-input"}>
            <div className={"dfa-fields-container"}>
                <label htmlFor={"states"}>
                    States
                    <span
                        className={"info-tooltip"}
                        data-tip
                        data-for="states-help"
                    >
                        ?
                    </span>
                </label>
                <Tooltip
                    place={"top"}
                    type={"info"}
                    id="states-help"
                    effect={"solid"}
                    multiline={true}
                >
                    <span>
                        The states of the DFA in the form of comma-separated
                        list
                        <br /> e.g. 'q0,q1,q2' or 'p,q'. Can not contain
                        duplicate states.
                        <br />
                        <br />
                        The first state listed is assumed to be the starting
                        state of the DFA.
                    </span>
                </Tooltip>
                <input
                    name={"states"}
                    type={"text"}
                    placeholder={"q1,q2..."}
                    onChange={(event) => {
                        const newStates = event.target.value.split(",");
                        if (
                            newStates.length > 0 &&
                            newStates[newStates.length - 1] === ""
                        ) {
                            newStates.pop();
                        }
                        const transitionsCopy: TransitionData = new Map();
                        for (let state of newStates) {
                            if (transitions.has(state)) {
                                transitionsCopy.set(
                                    state,
                                    transitions.get(state)!
                                );
                            } else {
                                const newStateTransitions = new Map();
                                transitionsCopy.set(state, newStateTransitions);
                                for (let symbol of alphabet) {
                                    newStateTransitions.set(symbol, "");
                                }
                            }
                        }
                        setStates(newStates);
                        setTransitions(transitionsCopy);
                    }}
                    className={statesValid ? "" : "invalid-input"}
                />
                <label htmlFor={"finalStates"}>
                    Final states
                    <span
                        className={"info-tooltip"}
                        data-tip
                        data-for="final-states-help"
                    >
                        ?
                    </span>
                </label>
                <Tooltip
                    place={"top"}
                    type={"info"}
                    id="final-states-help"
                    effect={"solid"}
                    multiline={true}
                >
                    <span>
                        The final (accepting) states of the DFA in the form of
                        comma-separated list.
                        <br /> These states must be listed in the 'States'
                        field. Can not contain duplicates.
                    </span>
                </Tooltip>
                <input
                    name={"finalStates"}
                    type={"text"}
                    placeholder={"q1,..."}
                    onChange={(event) => {
                        const newFinalStates = event.target.value.split(",");
                        if (
                            newFinalStates.length > 0 &&
                            newFinalStates[newFinalStates.length - 1] === ""
                        ) {
                            newFinalStates.pop();
                        }
                        setFinalStates(newFinalStates);
                    }}
                    className={finalStatesValid ? "" : "invalid-input"}
                />
            </div>
            {states.length > 0 ? (
                <TransitionsInput
                    states={states}
                    alphabet={alphabet}
                    transitions={transitions}
                    setTransition={(from, symbol, to) => {
                        const transitionsCopy: TransitionData = new Map(
                            transitions
                        );
                        transitionsCopy.get(from)!.set(symbol, to);
                        setTransitions(transitionsCopy);
                    }}
                    setTransitionsValid={setTransitionsValid}
                />
            ) : (
                ""
            )}
            <InputConverter
                transitions={transitions}
                alphabet={alphabet}
                finalStates={finalStates}
                states={states}
                validInput={
                    statesValid &&
                    alphabetValid &&
                    finalStatesValid &&
                    transitionsValid
                }
                convertInputCallback={convertInputCallback}
            />
        </div>
    );
}
