import {useState} from "react";
import TransitionsInput from "./TransitionsInput";
type MapInput = Map<string, Map<string, string>>

export default function DfaInput() {
    const [states, setStates] = useState<string[]>([]);
    const [finalStates, setFinalStates] = useState<string[]>([]);
    const [alphabet, setAlphabet] = useState<string[]>([]);
    const [transitions, setTransitions] = useState<MapInput>(new Map());

    const statesValid = new Set(states).size === states.length;
    const finalStatesValid = new Set(alphabet).size === alphabet.length && finalStates.every(s => states.includes(s));
    const alphabetValid = new Set(alphabet).size === alphabet.length;

    return (<div>
        <input type={"text"} placeholder={"q1,q2..."} onChange={(event) => {
            const newStates = event.target.value.split(",");
            if (newStates.length > 0 && newStates[newStates.length - 1] === "") {
                newStates.pop()
            }
            const transitionsCopy : MapInput = new Map();
            for (let state of newStates) {
                if (transitions.has(state)) {
                    transitionsCopy.set(state, transitions.get(state)!);
                } else {
                    const newStateTransitions = new Map();
                    transitionsCopy.set(state, newStateTransitions);
                    for (let symbol of alphabet) {
                        newStateTransitions.set(symbol, "");
                    }
                }
            }
            setStates(newStates)
            setTransitions(transitionsCopy);

        }} className={statesValid ? "" : "invalid-input"}/>
        <input type={"text"} placeholder={"0,1,..."} onChange={(event) => {
            const newAlphabet = event.target.value.split(",");
            if (newAlphabet.length > 0 && newAlphabet[newAlphabet.length - 1] === "") {
                newAlphabet.pop()
            }
            const transitionsCopy : MapInput = new Map(transitions);

            for (let state of states) {
                const t = transitionsCopy.get(state)!;
                for (let symbol of t.keys()) {
                    if (!newAlphabet.includes(symbol)) {
                        t.delete(symbol);
                    }
                }
                for (let symbol of newAlphabet) {
                    if (!t.has(symbol)) {
                        t.set(symbol, "")
                    }
                }
            }
            setAlphabet(newAlphabet);
            setTransitions(transitionsCopy)
        }} className={alphabetValid ? "" : "invalid-input"}/>
        <input type={"text"} placeholder={"q1,..."} onChange={(event) => {
            const newFinalStates = event.target.value.split(",");
            if (newFinalStates.length > 0 && newFinalStates[newFinalStates.length - 1] === "") {
                newFinalStates.pop()
            }
            setFinalStates(newFinalStates);
        }} className={finalStatesValid ? "" : "invalid-input"}/>
        {states.length > 0 ? <TransitionsInput states={states} alphabet={alphabet} transitions={transitions} setTransition={(from, symbol, to) => {
            const transitionsCopy : MapInput = new Map(transitions);
            console.log("adding transition", from, symbol, to)
            transitionsCopy.get(from)!.set(symbol, to);
            setTransitions(transitionsCopy);
            return states.includes(to);
        }}/> : ""}
    </div>)
}