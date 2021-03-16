import { DatasetGenerator } from "../../types/Dataset";
import { State } from "../../types/DFA";

const shuffle = <T>(array: T[]) => {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

/**
 * creates a DFA with a transition graph that is connected but transitions are allocated randomly between states
 */
const randomDatasetGenerator: DatasetGenerator = (
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

    let deadStates = shuffle(states.slice(1));
    let fromStates = [states[0]];

    // connect all states with transitions
    while (deadStates.length > 0) {
        const from = fromStates[Math.floor(Math.random() * fromStates.length)];
        const existingTransitions = Array.from(from.transitions.keys());
        const eligibleTransitions = alphabet.filter((s) => !existingTransitions.includes(s));
        const symbol = eligibleTransitions[Math.floor(Math.random() * eligibleTransitions.length)];
        const dest = deadStates.pop()!;

        from.transitions.set(symbol, dest);
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

const webDatasetGenerator: DatasetGenerator = (
    statesCount,
    alphabet,
    finalStatesCount,
    statePrefix
) => {
    const states: State[] = [];
    const finalStates: Set<State> = new Set<State>();
    for (let i = 0; i < statesCount; i++) {
        const state = { name: `${statePrefix}${i}`, transitions: new Map<string, State>() };
        states.push(state);
    }

    let window = 1;
    let windowSum = 1;
    for (let i = 0; i < states.length; i++) {
        if (i >= windowSum) {
            window *= 2;
            windowSum += window;
        }
        for (let j = 0; j < alphabet.length; j++) {
            const symbol = alphabet[j];
            const dest = i + window * (j + 1);
            // console.log(`(window ${window}) from ${i} to ${dest}`);
            if (dest < states.length) {
                states[i].transitions.set(symbol, states[dest]);
            } else {
                states[i].transitions.set(symbol, states[0]); // todo loop around?
            }
        }

        if (i >= window - 1 && i < (windowSum + window) / 2 - 1) {
            finalStates.add(states[i]);
            // console.log(`add final state ${states[i].name}`);
        }
    }

    return {
        alphabet: alphabet,
        finalStates: finalStates,
        startingState: states[0],
        states: states,
    };
};

/**
 * creates a full n-ary tree where n = alphabet.length. Final states are assigned starting from leaf nodes in a reverse-BFS manner.
 */
const sprawlingDatasetGenerator: DatasetGenerator = (
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
    for (let i = 0; i < states.length; i++) {
        const from = states[i];
        for (let j = 0; j < alphabet.length; j++) {
            const symbol = alphabet[j];
            const targetIndex = i * alphabet.length + j + 1;
            if (targetIndex < states.length) {
                const target = states[targetIndex];
                from.transitions.set(symbol, target);
            }
        }
    }
    for (let state of states) {
        for (let symbol of alphabet) {
            if (!state.transitions.has(symbol)) {
                state.transitions.set(symbol, state);
            }
        }
    }

    const finalStates = new Set<State>();
    for (let i = 0; i < finalStatesCount; i++) {
        finalStates.add(states[states.length - 1 - i]);
    }
    return { states, startingState: states[0], finalStates, alphabet };
};

const linearDatasetGenerator: DatasetGenerator = (
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

    for (let i = 0; i < statesCount - 1; i++) {
        const state = states[i];
        const to = states[i + 1];
        for (let symbol of alphabet) {
            state.transitions.set(symbol, to);
        }
    }
    for (let symbol of alphabet) {
        states[states.length - 1].transitions.set(symbol, states[states.length - 1]);
    }

    const finalStates = new Set<State>();
    for (let i = 0; i < finalStatesCount; i++) {
        finalStates.add(states[states.length - 1 - i]);
    }

    return {
        states,
        finalStates,
        startingState: states[0],
        alphabet,
    };
};

export {
    randomDatasetGenerator,
    sprawlingDatasetGenerator,
    linearDatasetGenerator,
    webDatasetGenerator,
};
