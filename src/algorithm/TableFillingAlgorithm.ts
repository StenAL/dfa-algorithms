import HashMap from "hashmap";
import UnionFind from "mnemonist/static-disjoint-set";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
    Log,
} from "../types/Algorithm";
import { DFA, State } from "../types/DFA";
import minimizer from "./Minimizer";

export enum TableFillingAlgorithmState {
    EMPTY_TABLE,
    MARKING_PAIRS,
    ALL_PAIRS_MARKED,
    CONSTRUCTING_WITNESS,
    INDISTINGUISHABLE_STATE_GROUPS_IDENTIFIED,
}

interface TableFillingAlgorithmInterface extends Algorithm {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;
    unmarkedPairs: HashMap<[State, State], undefined>;
    result: EquivalenceTestingResult | DFA;
    iteration: number;
    mode: AlgorithmMode;
}

export default class TableFillingAlgorithm implements TableFillingAlgorithmInterface {
    input1: DFA;
    pairs: HashMap<[State, State], string>;
    log?: Log;
    state: TableFillingAlgorithmState | CommonAlgorithmState;
    unmarkedPairs: HashMap<[State, State], undefined>;
    type: "tableFilling" | "tableFillingWitness";
    iteration: number;

    mode: AlgorithmMode;
    result: EquivalenceTestingResult | DFA;
    input2: DFA;
    produceWitness: boolean;
    witness: string;

    indistinguishableStateGroups: State[][];

    constructor(input1: DFA, input2?: DFA, produceWitness?: boolean) {
        this.type = produceWitness ? "tableFillingWitness" : "tableFilling";
        this.input1 = input1;
        this.input2 = input2 ?? input1;
        this.log = undefined;
        this.state = CommonAlgorithmState.INITIAL;
        this.pairs = new HashMap();
        this.unmarkedPairs = new HashMap<[State, State], undefined>();
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.iteration = 1;
        this.mode = input2 ? AlgorithmMode.EQUIVALENCE_TESTING : AlgorithmMode.STATE_MINIMIZATION;
        this.produceWitness = produceWitness ?? false;
        this.witness = "";
        this.indistinguishableStateGroups = [];
    }

    reset(): void {
        this.state = CommonAlgorithmState.INITIAL;
        this.pairs = new HashMap();
        this.unmarkedPairs = new HashMap<[State, State], never>();
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.iteration = 1;
        this.log?.clear();
        this.witness = "";
        this.indistinguishableStateGroups = [];
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
            case TableFillingAlgorithmState.CONSTRUCTING_WITNESS:
                this.constructWitness();
                break;
            case TableFillingAlgorithmState.INDISTINGUISHABLE_STATE_GROUPS_IDENTIFIED:
                this.combineIndistinguishableGroups();
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    createTable() {
        if (this.log) {
            this.log.log("Creating initial table from DFA states.");
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
                this.log?.log(`Added pair (${state1.name},${state2.name}) to table`);
            }
        }
        this.log?.log(`Added ${this.pairs.count()} pairs to table`);
        this.state = TableFillingAlgorithmState.EMPTY_TABLE;
    }

    initializeTable() {
        let acceptingStates: Set<State> = new Set<State>();
        let nonAcceptingStates;
        if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
            acceptingStates = new Set([...this.input1.finalStates, ...this.input2.finalStates]);
            nonAcceptingStates = this.input1.states
                .concat(this.input2.states)
                .filter((s) => !acceptingStates.has(s));
        } else {
            acceptingStates = new Set(this.input1.finalStates);
            nonAcceptingStates = this.input1.states.filter((s) => !acceptingStates.has(s));
        }
        let markedCount = 0;
        for (let acceptingState of acceptingStates) {
            for (let nonAcceptingState of nonAcceptingStates) {
                const pair = this.getPair(acceptingState, nonAcceptingState);
                if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING && this.produceWitness) {
                    this.pairs.set(pair, "ε");
                } else {
                    this.pairs.set(pair, "X");
                }
                this.unmarkedPairs.delete(pair);
                markedCount++;
                this.log?.log(`Marked pair (${acceptingState.name},${nonAcceptingState.name})`);
            }
        }

        this.log?.log(`Marked ${markedCount} initial pair${markedCount === 1 ? "" : "s"}.`);
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
                if (this.pairs.has(successorPair) && this.pairs.get(successorPair) !== "") {
                    if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING && this.produceWitness) {
                        this.pairs.set(unmarkedPair, symbol);
                    } else {
                        this.pairs.set(unmarkedPair, "X");
                    }

                    if (this.unmarkedPairs.has(unmarkedPair)) {
                        this.unmarkedPairs.delete(unmarkedPair);
                        this.log?.log(
                            `Marked pair (${unmarkedPair[0].name},${unmarkedPair[1].name})`
                        );
                    }
                }
            }
        }

        if (unmarkedPairsCopy.count() !== this.unmarkedPairs.count()) {
            // new pairs have been marked
            const markedCount = unmarkedPairsCopy.count() - this.unmarkedPairs.count();
            this.log?.log(
                `Iteration ${this.iteration}: marked ${markedCount} pair${
                    markedCount === 1 ? "" : "s"
                }.`
            );
            this.state = TableFillingAlgorithmState.MARKING_PAIRS;
        } else {
            this.log?.log(
                `Iteration ${this.iteration}: no additional pairs have been marked. All distinguishable pairs have been identified.`
            );
            this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED;
        }
        this.iteration++;
    }

    testStartingStatesAreDistinguishable() {
        const q1 = this.input1.startingState;
        const q2 = this.input2.startingState;
        const startingPair = this.getPair(q1, q2);

        if (this.pairs.get(startingPair) === "") {
            this.result = EquivalenceTestingResult.EQUIVALENT;
            this.log?.log(
                `Starting states ${q1.name} and ${q2.name} are indistinguishable, therefore the DFAs are equivalent`
            );
        } else {
            this.result = EquivalenceTestingResult.NON_EQUIVALENT;
            this.log?.log(
                `Starting states ${q1.name} and ${q2.name} are distinguishable, therefore the DFAs are non-equivalent`
            );
        }
        if (!this.produceWitness) {
            this.state = CommonAlgorithmState.FINAL;
        } else {
            this.state = TableFillingAlgorithmState.CONSTRUCTING_WITNESS;
        }
    }

    constructWitness() {
        let witness = "";
        let p = this.input1.startingState;
        let q = this.input2.startingState;
        let symbol = this.pairs.get(this.getPair(p, q));
        if (symbol === "ε") {
            this.log?.log(`Witness: the DFAs can be distinguished by the empty string ''`);
        }
        this.log?.log(`Constructing witness: Comparing starting states ${p.name} and ${q.name}`);
        while (this.input1.finalStates.has(p) === this.input2.finalStates.has(q)) {
            this.log?.log(`${p.name} and ${q.name} are distinguished by the symbol ${symbol}`);
            witness += symbol;
            this.log?.log(`Appending ${symbol} to the witness string, it is now ${witness}`);
            let previousP = p.name;
            let previousQ = q.name;
            p = p.transitions.get(symbol)!;
            q = q.transitions.get(symbol)!;
            this.log?.log(
                `On input ${symbol}, ${previousP} transitions to ${p.name} and ${previousQ} transitions to ${q.name}`
            );
            symbol = this.pairs.get(this.getPair(p, q));
        }

        if (this.input1.finalStates.has(p)) {
            this.log?.log(`${p.name} is an accepting state while ${q.name} is not.`);
            this.log?.log(
                `Witness: ${witness}. Input 1 accepts the witness string while input 2 rejects it.`
            );
        } else {
            this.log?.log(`${q.name} is an accepting state while ${p.name} is not.`);
            this.log?.log(
                `Witness: ${witness}. Input 2 accepts the witness string while input 1 rejects it.`
            );
        }
        this.witness = witness;
        this.state = CommonAlgorithmState.FINAL;
    }

    identifyIndistinguishableGroups() {
        if (this.unmarkedPairs.count() === 0) {
            this.log?.log("All pairs have been marked, no states can be combined");
            this.state = CommonAlgorithmState.FINAL;
        } else {
            const unmarkedStates = Array.from(new Set(this.unmarkedPairs.keys().flat()));
            const unmarkedStatesNames = unmarkedStates.map((u) => u.name);
            this.log?.log(
                `Identified states that are in at least one unmarked pair: {${unmarkedStatesNames}}`
            );
            const unionFind = new UnionFind(unmarkedStates.length);
            for (let [p, q] of this.unmarkedPairs.keys()) {
                unionFind.union(unmarkedStates.indexOf(p), unmarkedStates.indexOf(q));
            }
            const combinedStates = unionFind
                .compile()
                .map((combinedIndices) => combinedIndices.map((i) => unmarkedStates[i]));
            this.log?.log(
                `Can combine indistinguishable states ${combinedStates
                    .map((states) => `{${states.map((s) => s.name)}}`)
                    .join(", ")}`
            );
            this.indistinguishableStateGroups = combinedStates;
            this.state = TableFillingAlgorithmState.INDISTINGUISHABLE_STATE_GROUPS_IDENTIFIED;
        }
    }

    combineIndistinguishableGroups() {
        this.log?.log("Creating minimized DFA.");
        this.result = minimizer.combineStates(this.input1, this.indistinguishableStateGroups);
        this.state = CommonAlgorithmState.FINAL;
    }
}
