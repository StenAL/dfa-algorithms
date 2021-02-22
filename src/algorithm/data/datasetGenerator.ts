import { DatasetGenerator } from "../../types/Dataset";
import { State } from "../../types/DFA";

export const randomDatasetGenerator: DatasetGenerator = (
    statesCount,
    alphabet,
    finalStatesCount,
    statePrefix = "q"
) => {
    if (alphabet.length === 0 || statesCount === 0 || statesCount < finalStatesCount) {
        throw Error("Invalid input to dataset generator");
    }

    const states: State[] = [];
    for (let i = 0; i < statesCount; i++) {
        states.push({ name: `${statePrefix}${i}`, transitions: new Map<string, State>() });
    }

    let deadStates = [...states.slice(1)];
    let fromStates = [states[0]];

    // connect all states with transitions
    while (deadStates.length > 0) {
        const from = fromStates[Math.floor(Math.random() * fromStates.length)];
        const existingTransitions = Array.from(from.transitions.keys());
        const eligibleTransitions = alphabet.filter((s) => !existingTransitions.includes(s));
        const symbol = eligibleTransitions[Math.floor(Math.random() * eligibleTransitions.length)];
        const dest = deadStates[Math.floor(Math.random() * deadStates.length)];

        from.transitions.set(symbol, dest);
        deadStates = deadStates.filter((s) => s !== dest);
        fromStates.push(dest);
        if (eligibleTransitions.length === 1) {
            // exhausted all possible transitions of 'from'
            fromStates = fromStates.filter((s) => s !== from);
        }
    }

    // fill in missing transitions
    for (let state of states) {
        for (let symbol of alphabet) {
            if (!state.transitions.has(symbol)) {
                const dest = states[Math.floor(Math.random() * states.length)];
                state.transitions.set(symbol, dest);
            }
        }
    }

    let nonFinalStates = [...states];
    const finalStates = new Set<State>();
    for (let i = 0; i < finalStatesCount; i++) {
        const state = nonFinalStates[Math.floor(Math.random() * nonFinalStates.length)];
        nonFinalStates = nonFinalStates.filter((s) => s !== state);
        finalStates.add(state);
    }

    return {
        alphabet: alphabet,
        finalStates: finalStates,
        startingState: states[0],
        states: states,
    };
};
