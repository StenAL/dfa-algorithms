import HashMap from "hashmap";
import { Algorithm, CommonAlgorithmState, EquivalenceTestingResult } from "../types/Algorithm";
import { DFA, State } from "../types/DFA";

export enum TableFillingAlgorithmState {
    EMPTY_TABLE,
    MARKING_PAIRS,
    ALL_PAIRS_MARKED,
}

interface TableFillingAlgorithmInterface extends Algorithm {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;
    unmarkedPairs: Set<[State, State]>;
    result: EquivalenceTestingResult;
    iteration: number;
}

export default class TableFillingAlgorithm
    implements TableFillingAlgorithmInterface {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;
    result: EquivalenceTestingResult;
    log: ((message: string) => void) | undefined;
    state: TableFillingAlgorithmState | CommonAlgorithmState;
    unmarkedPairs: Set<[State, State]>;
    type: "table-filling";
    iteration: number;

    constructor(input1: DFA, input2: DFA) {
        this.type = "table-filling";
        this.input1 = input1;
        this.input2 = input2;
        this.log = undefined;
        this.state = CommonAlgorithmState.INITIAL;
        this.pairs = new HashMap();
        this.unmarkedPairs = new Set();
        this.result = EquivalenceTestingResult.UNFINISHED;
        this.iteration = 1
    }

    reset(): void {
        this.state = CommonAlgorithmState.INITIAL;
        this.pairs = new HashMap();
        this.unmarkedPairs = new Set();
        this.result = EquivalenceTestingResult.UNFINISHED;
        this.iteration = 1
    }

    step() {
        switch (this.state) {
            case CommonAlgorithmState.INITIAL:
                this.createTable();
                break;
            case TableFillingAlgorithmState.EMPTY_TABLE:
                this.initializeTable();
                break;
            case TableFillingAlgorithmState.MARKING_PAIRS:
                this.markPairs();
                break;
            case TableFillingAlgorithmState.ALL_PAIRS_MARKED:
                this.testStartingStatesAreDistinguishable();
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    createTable() {
        if (this.log) {
            this.log("Creating initial table from DFAs");
        }
        const allStates = this.input1.states.concat(this.input2.states);
        for (let i = 0; i < allStates.length; i++) {
            const state1 = allStates[i];
            for (let j = i + 1; j < allStates.length; j++) {
                const state2 = allStates[j];
                const pair: [State, State] = [state1, state2];
                this.pairs.set(pair, "");
                this.unmarkedPairs.add(pair);
                if (this.log) {
                    this.log(
                        `Added pair (${state1.name},${state2.name}) to table`
                    );
                }
            }
        }
        this.state = TableFillingAlgorithmState.EMPTY_TABLE;
    }

    initializeTable() {
        const acceptingStates = new Set([
            ...this.input1.finalStates,
            ...this.input2.finalStates,
        ]);
        const nonAcceptingStates = this.input1.states
            .concat(this.input2.states)
            .filter((s) => !acceptingStates.has(s));
        let markedCount = 0;
        for (let acceptingState of acceptingStates) {
            for (let nonAcceptingState of nonAcceptingStates) {
                const pair = this.getPair(acceptingState, nonAcceptingState);
                this.pairs.set(pair, "X"); // set to empty string
                markedCount++;
                this.unmarkedPairs.delete(pair);
                if (this.log) {
                    this.log(
                        `Marked pair (${acceptingState.name},${nonAcceptingState.name})`
                    );
                }
            }
        }

        if (this.log) {
            this.log(`Marked ${markedCount} initial pair${markedCount === 1 ? "" : "s"}.`);
        }
        this.state = TableFillingAlgorithmState.MARKING_PAIRS;
    }

    private getPair(q1: State, q2: State): [State, State] {
        if (this.pairs.has([q1, q2])) {
            return [q1, q2];
        } else {
            return [q2, q1];
        }
    }

    markPairs() {
        const unmarkedPairsCopy = new Set(this.unmarkedPairs);
        for (let unmarkedPair of unmarkedPairsCopy) {
            for (let symbol of this.input1.alphabet) {
                const q = unmarkedPair[0].transitions.get(symbol)!;
                const p = unmarkedPair[1].transitions.get(symbol)!;
                const successorPair = this.getPair(q, p);
                if (this.pairs.get(successorPair) !== "") {
                    this.pairs.set(unmarkedPair, "X"); // set to symbol
                    this.unmarkedPairs.delete(unmarkedPair);
                    if (this.log) {
                        this.log(`Marked pair (${q.name},${p.name})`);
                    }
                }
            }
        }
        // new pairs have been marked
        if (unmarkedPairsCopy.size !== this.unmarkedPairs.size) {
            // console.log(`Marked ${unmarkedPairsCopy.size - this.unmarkedPairs.size} pairs`)
            if (this.log) {
                const markedCount = unmarkedPairsCopy.size - this.unmarkedPairs.size;
                this.log(
                    `Iteration ${this.iteration}: marked ${markedCount} pair${markedCount === 1 ? "" : "s"}.`
                );
            }
            this.state = TableFillingAlgorithmState.MARKING_PAIRS;
        } else {
            if (this.log) {
                this.log(
                    `Iteration ${this.iteration}: no additional pairs have been marked. All distinguishable pairs have been identified.`
                );
            }
            this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED;
        }
        this.iteration++;
    }

    testStartingStatesAreDistinguishable() {
        const q1 = this.input1.startingState;
        const q2 = this.input2.startingState;
        const startingPair = this.getPair(q1, q2);
        this.result =
            this.pairs.get(startingPair) === ""
                ? EquivalenceTestingResult.EQUIVALENT
                : EquivalenceTestingResult.NON_EQUIVALENT;
        if (this.log) {
            if (this.result === EquivalenceTestingResult.EQUIVALENT) {
                this.log(
                    `Starting states ${q1.name} and ${q2.name} are indistinguishable, therefore the DFAs are equivalent`
                );
            } else {
                this.log(
                    `Starting states ${q1.name} and ${q2.name} are distinguishable, therefore the DFAs are non-equivalent`
                );
            }
        }
        this.state = CommonAlgorithmState.FINAL;
    }

}
