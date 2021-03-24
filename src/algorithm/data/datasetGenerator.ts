import { DatasetGenerator } from "../../types/Dataset";
import { State } from "../../types/DFA";

const shuffle = <T>(array: T[]) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

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

const getDeBruijnString = (alphabet: string, n: number): string => {
    const length = alphabet.length;
    let a: number[] = Array(length * n).fill(0);
    let sequence: number[] = [];

    const db = (t: number, p: number) => {
        if (t > n) {
            if (n % p === 0) {
                const extendBy = a.slice(1, p + 1);
                sequence.push(...extendBy);
            }
        } else {
            a[t] = a[t - p];
            db(t + 1, p);
            for (let j = a[t - p] + 1; j < length; j++) {
                a[t] = j;
                db(t + 1, t);
            }
        }
    };
    db(1, 1);
    return sequence.map((i) => alphabet[i]).join("");
};

const deBruijnDatasetGenerator: DatasetGenerator = (
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
        for (let symbol of alphabet) {
            const target = states[(i + 1) % states.length];
            from.transitions.set(symbol, target);
        }
    }

    const finalStates = new Set<State>();
    let x = 0;
    while (2 ** x < statesCount) {
        x += 1;
    }
    const deBruijnString = getDeBruijnString("01", x);
    for (let i = 0; i < statesCount; i++) {
        if (finalStates.size === finalStatesCount) break;
        if (deBruijnString[i] === "1") {
            finalStates.add(states[i]);
        }
    }

    while (finalStates.size < finalStatesCount) {
        const nonFinalState = states.find((s) => !finalStates.has(s))!;
        finalStates.add(nonFinalState);
    }

    return { states, startingState: states[0], finalStates, alphabet };
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
    deBruijnDatasetGenerator,
};
