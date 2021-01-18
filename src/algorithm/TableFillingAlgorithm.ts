import HashMap from "hashmap";
import {Algorithm, EquivalenceTestingResult} from "../types/Algorithm";
import {DFA, State} from "../types/DFA";


export enum TableFillingAlgorithmState {
    INITIAL,
    EMPTY_TABLE,
    MARKING_PAIRS,
    ALL_PAIRS_MARKED,
    FINAL
}


interface TableFillingAlgorithmInterface extends Algorithm {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;
    unmarkedPairs: Set<[State, State]>;
    result: EquivalenceTestingResult;
}


export default class TableFillingAlgorithm implements TableFillingAlgorithmInterface {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;
    result: EquivalenceTestingResult

    constructor(input1: DFA, input2: DFA) {
        this.state = TableFillingAlgorithmState.INITIAL
        this.input1 = input1
        this.input2 = input2
        this.pairs = new HashMap()
        this.unmarkedPairs = new Set()
        this.result = EquivalenceTestingResult.UNFINISHED
    }

    step() {
        switch (this.state) {
            case TableFillingAlgorithmState.INITIAL:
                this.createTable();
                break;
            case TableFillingAlgorithmState.EMPTY_TABLE:
                this.initializeTable()
                break;
            case TableFillingAlgorithmState.MARKING_PAIRS:
                this.markPairs()
                break;
            case TableFillingAlgorithmState.ALL_PAIRS_MARKED:
                this.testStartingStatesAreDistinguishable()
                break;
            case TableFillingAlgorithmState.FINAL:
                break;
        }
    }

    createTable() {
        const allStates = this.input1.states.concat(this.input2.states)
        for (let i = 0; i < allStates.length; i++) {
            const state1 = allStates[i];
            for (let j = i + 1; j < allStates.length; j++) {
                const state2 = allStates[j];
                const pair: [State, State] = [state1, state2]
                this.pairs.set(pair, "")
                this.unmarkedPairs.add(pair)
            }
        }
        this.state = TableFillingAlgorithmState.EMPTY_TABLE
    }

    initializeTable() {
        const acceptingStates = new Set([...this.input1.finalStates, ...this.input2.finalStates])
        const nonAcceptingStates = this.input1.states.concat(this.input2.states).filter(s => !acceptingStates.has(s))
        for (let acceptingState of acceptingStates) {
            for (let nonAcceptingState of nonAcceptingStates) {
                const pair = this.getPair(acceptingState, nonAcceptingState)
                this.pairs.set(pair, "X") // set to empty string
                this.unmarkedPairs.delete(pair)
            }
        }
        this.state = TableFillingAlgorithmState.MARKING_PAIRS
    }

    private getPair(q1: State, q2: State): [State, State] {
        if (this.pairs.has([q1, q2])) {
            return [q1, q2]
        } else {
            return [q2, q1]
        }
    }

    markPairs() {
        const unmarkedPairsCopy = new Set(this.unmarkedPairs)
        for (let unmarkedPair of unmarkedPairsCopy) {
            for (let symbol of this.input1.alphabet) {
                const q = unmarkedPair[0].transitions.get(symbol)!
                const p = unmarkedPair[1].transitions.get(symbol)!
                const successorPair = this.getPair(q, p)
                if (this.pairs.get(successorPair) !== "") {
                    this.pairs.set(unmarkedPair, "X") // set to symbol
                    this.unmarkedPairs.delete(unmarkedPair)
                }
            }
        }
        // new pairs have been marked
        if (unmarkedPairsCopy.size !== this.unmarkedPairs.size) {
            console.log(`Marked ${unmarkedPairsCopy.size - this.unmarkedPairs.size} pairs`)
            this.state = TableFillingAlgorithmState.MARKING_PAIRS
        } else {
            console.log("Done marking")
            console.log(this.pairs)
            this.state = TableFillingAlgorithmState.ALL_PAIRS_MARKED
        }
    }

    testStartingStatesAreDistinguishable() {
        const q1 = this.input1.startingState
        const q2 = this.input2.startingState
        const startingPair = this.getPair(q1, q2)
        this.result = this.pairs.get(startingPair) === "" ? EquivalenceTestingResult.EQUIVALENT : EquivalenceTestingResult.NON_EQUIVALENT
        this.state = TableFillingAlgorithmState.FINAL
    }

    state: TableFillingAlgorithmState;
    unmarkedPairs: Set<[State, State]>;
}