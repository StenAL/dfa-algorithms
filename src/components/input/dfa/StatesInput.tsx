import HashMap from "hashmap";
import { useEffect, useState } from "react";
import { default as Tooltip } from "react-tooltip";
import { DFA } from "../../../types/DFA";
import InputConverter from "./InputConverter";
import TransitionsInput from "./TransitionsInput";

export type TransitionData = HashMap<[string, string], string>; // (from, symbol) -> to

interface StatesInputProps {
    alphabet: string[];
    existingStates: string[];
    existingFinalStates: string[];
    existingTransitions: [string, string, string][];
    alphabetValid: boolean;
    convertInputCallback: (dfa: DFA | undefined) => void;
}

export default function StatesInput({
    convertInputCallback,
    existingStates,
    existingFinalStates,
    existingTransitions,
    alphabet,
    alphabetValid,
}: StatesInputProps) {
    const [states, setStates] = useState<string[]>([]);
    const [finalStates, setFinalStates] = useState<string[]>([]);
    const [transitions, setTransitions] = useState<TransitionData>(new HashMap());
    const [transitionsValid, setTransitionsValid] = useState<boolean>(false);
    console.log(existingTransitions);
    useEffect(() => {
        setStates(existingStates);
    }, [existingStates]);

    useEffect(() => {
        setFinalStates(existingFinalStates);
    }, [existingFinalStates]);

    useEffect(() => {
        const transitionsCopy: TransitionData = new HashMap<[string, string], string>(transitions);
        for (let [[from, symbol]] of transitionsCopy.entries()) {
            if (!alphabet.includes(symbol)) {
                transitionsCopy.delete([from, symbol]);
            }
        }
        for (let symbol of alphabet) {
            for (let state of states) {
                const pair: [string, string] = [state, symbol];
                if (!transitionsCopy.has(pair)) {
                    transitionsCopy.set(pair, "");
                }
            }
        }
        setTransitions(transitionsCopy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alphabet]);

    useEffect(() => {
        const newTransitions = new HashMap<[string, string], string>();
        for (let [from, symbol, to] of existingTransitions) {
            newTransitions.set([from, symbol], to);
        }
        setTransitions(newTransitions);
    }, [existingTransitions]);

    // transitions.entries().forEach(([[from, symbol], to]) => console.log(`${from}:${symbol} > ${to}`));
    const statesValid = states.length > 0 && new Set(states).size === states.length;
    const finalStatesValid =
        new Set(finalStates).size === finalStates.length &&
        finalStates.every((s) => states.includes(s));

    return (
        <div className={"states-input-container"}>
            <div className={"states-input"}>
                <label htmlFor={"states"}>
                    States
                    <span className={"info-tooltip"} data-tip data-for="states-help">
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
                        The states of the DFA in the form of comma-separated list
                        <br /> e.g. 'q0,q1,q2' or 'p,q'. Can not contain duplicate states.
                        <br />
                        <br />
                        The first state listed is assumed to be the starting state of the DFA.
                    </span>
                </Tooltip>
                <input
                    name={"states"}
                    type={"text"}
                    placeholder={"q1,q2..."}
                    value={states.join(",")}
                    onChange={(event) => {
                        const newStates = event.target.value.split(",");
                        if (newStates.length > 0 && newStates[newStates.length - 1] === "") {
                            newStates.pop();
                        }
                        const transitionsCopy: TransitionData = new HashMap<
                            [string, string],
                            string
                        >();
                        for (let state of newStates) {
                            for (let symbol of alphabet) {
                                const pair: [string, string] = [state, symbol];
                                if (transitions.has(pair)) {
                                    transitionsCopy.set(pair, transitions.get(pair)!);
                                } else {
                                    transitionsCopy.set(pair, "");
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
                    <span className={"info-tooltip"} data-tip data-for="final-states-help">
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
                        The final (accepting) states of the DFA in the form of comma-separated list.
                        <br /> These states must be listed in the 'States' field. Can not contain
                        duplicates.
                    </span>
                </Tooltip>
                <input
                    defaultValue={existingFinalStates.join(",")}
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
            {states.length > 0 && alphabet.length > 0 ? (
                <TransitionsInput
                    states={states}
                    alphabet={alphabet}
                    transitions={transitions}
                    setTransition={(from, symbol, to) => {
                        const transitionsCopy: TransitionData = new HashMap<
                            [string, string],
                            string
                        >(transitions);
                        transitionsCopy.set([from, symbol], to);
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
                validInput={statesValid && alphabetValid && finalStatesValid && transitionsValid}
                convertInputCallback={convertInputCallback}
            />
        </div>
    );
}
