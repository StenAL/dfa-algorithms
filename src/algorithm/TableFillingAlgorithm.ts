import HashMap from "hashmap";
import { Algorithm, AlgorithmMode, CommonAlgorithmState, EquivalenceTestingResult, Log } from "../types/Algorithm";
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
    unmarkedPairs: HashMap<[State, State], undefined>;
    result: EquivalenceTestingResult;
    iteration: number;
    mode: AlgorithmMode;
}

export default class TableFillingAlgorithm
    implements TableFillingAlgorithmInterface {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;
    result: EquivalenceTestingResult;
    log?: Log;
    state: TableFillingAlgorithmState | CommonAlgorithmState;
    unmarkedPairs: HashMap<[State, State], undefined>;
    type: "table-filling";
    iteration: number;
    mode: AlgorithmMode;

    constructor(input1: DFA, input2?: DFA) {
        this.type = "table-filling";
        this.input1 = input1;
        this.input2 = input2 ?? input1;
        this.log = undefined;
        this.state = CommonAlgorithmState.INITIAL;
        this.pairs = new HashMap();
        this.unmarkedPairs = new HashMap<[State, State], undefined>();
        this.result = EquivalenceTestingResult.UNFINISHED;
        this.iteration = 1;
        this.mode = input2 ? AlgorithmMode.EQUIVALENCE_TESTING : AlgorithmMode.STATE_MINIMIZATION;
    }

    reset(): void {
        this.state = CommonAlgorithmState.INITIAL;
        this.pairs = new HashMap();
        this.unmarkedPairs = new HashMap<[State, State], never>();
        this.result = EquivalenceTestingResult.UNFINISHED;
        this.iteration = 1;
        this.log?.clear();
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
                if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
                    this.testStartingStatesAreDistinguishable();
                } else if (this.mode === AlgorithmMode.STATE_MINIMIZATION) {
                    this.identifyIndistinguishableGroups();
                }
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    createTable() {
        if (this.log) {
            this.log.log(("Creating initial table from DFA states."));
        }
        let allStates: State[];
        if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
            allStates = this.input1.states.concat(this.input2.states);
        } else {
            allStates = this.input1.states;
        }
        for (let i = 0; i < allStates.length; i++) {
            const state1 = allStates[i];
            for (let j = i + 1; j < allStates.length; j++) {
                const state2 = allStates[j];
                const pair: [State, State] = [state1, state2];
                this.pairs.set(pair, "");
                this.unmarkedPairs.set(pair, undefined);
                this.log?.log((
                    `Added pair (${state1.name},${state2.name}) to table`
                ));
            }
        }
        this.log?.log((
            `Added ${this.pairs.count()} pairs to table`
        ));
        this.state = TableFillingAlgorithmState.EMPTY_TABLE;
    }

    initializeTable() {
        let acceptingStates: Set<State> = new Set<State>();
        let nonAcceptingStates;
        if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
            acceptingStates = new Set([
                ...this.input1.finalStates,
                ...this.input2.finalStates
            ]);
            nonAcceptingStates = this.input1.states
                .concat(this.input2.states)
                .filter((s) => !acceptingStates.has(s));
        } else {
            acceptingStates = new Set(this.input1.finalStates,);
            nonAcceptingStates = this.input1.states
                .filter((s) => !acceptingStates.has(s));
        }
        let markedCount = 0;
        for (let acceptingState of acceptingStates) {
            for (let nonAcceptingState of nonAcceptingStates) {
                const pair = this.getPair(acceptingState, nonAcceptingState);
                this.pairs.set(pair, "X"); // set to empty string in witness mode
                this.unmarkedPairs.delete(pair);
                markedCount++;
                this.log?.log((
                    `Marked pair (${acceptingState.name},${nonAcceptingState.name})`
                ));
            }
        }

        this.log?.log((`Marked ${markedCount} initial pair${markedCount === 1 ? "" : "s"}.`));
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
        const unmarkedPairsCopy = new HashMap(this.unmarkedPairs);
        for (let unmarkedPair of unmarkedPairsCopy.keys()) {
            for (let symbol of this.input1.alphabet) {
                const q = unmarkedPair[0].transitions.get(symbol)!;
                const p = unmarkedPair[1].transitions.get(symbol)!;
                const successorPair = this.getPair(q, p);
                if (this.pairs.get(successorPair) !== "") {
                    this.pairs.set(unmarkedPair, "X"); // set to symbol in witness mode
                    if (this.unmarkedPairs.has(unmarkedPair)) {
                        this.unmarkedPairs.delete(unmarkedPair);
                        this.log?.log((`Marked pair (${unmarkedPair[0].name},${unmarkedPair[1].name})`));
                    }
                }
            }
        }

        if (unmarkedPairsCopy.count() !== this.unmarkedPairs.count()) { // new pairs have been marked
            const markedCount = unmarkedPairsCopy.count() - this.unmarkedPairs.count();
            this.log?.log((
                `Iteration ${this.iteration}: marked ${markedCount} pair${markedCount === 1 ? "" : "s"}.`
            ));
            this.state = TableFillingAlgorithmState.MARKING_PAIRS;
        } else {
            this.log?.log((
                `Iteration ${this.iteration}: no additional pairs have been marked. All distinguishable pairs have been identified.`
            ));
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
        if (this.result === EquivalenceTestingResult.EQUIVALENT) {
            this.log?.log((
                `Starting states ${q1.name} and ${q2.name} are indistinguishable, therefore the DFAs are equivalent`
            ));
        } else {
            this.log?.log((
                `Starting states ${q1.name} and ${q2.name} are distinguishable, therefore the DFAs are non-equivalent`
            ));
        }
        this.state = CommonAlgorithmState.FINAL;
    }

    identifyIndistinguishableGroups() {
        // TODO
        this.log?.log("Identifying indistinguishable groups: *TODO*")
        this.state = CommonAlgorithmState.FINAL;
    }

}
