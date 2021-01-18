import {DFA, State} from "../types/DFA";
import {Algorithm} from "../types/Algorithm";
import HashMap from "hashmap";


export enum TableFillingAlgorithmState {
    INITIAL,
    EMPTY_TABLE,
    ACCEPTING_PAIRS_DISTINGUISHED,
    FINAL
}



interface TableFillingAlgorithmInterface extends Algorithm {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;

}


export default class TableFillingAlgorithm implements TableFillingAlgorithmInterface {
    input1: DFA;
    input2: DFA;
    pairs: HashMap<[State, State], string>;

    constructor(input1: DFA, input2: DFA) {
        this.state = TableFillingAlgorithmState.INITIAL
        this.input1 = input1
        this.input2 = input2
        this.pairs = new HashMap()
    }

    step() {
        switch (this.state) {
            case TableFillingAlgorithmState.INITIAL:
                this.createTable();
                break;
            case TableFillingAlgorithmState.EMPTY_TABLE:
                this.initializeTable()
                break;
            case TableFillingAlgorithmState.ACCEPTING_PAIRS_DISTINGUISHED:
                break;
            case TableFillingAlgorithmState.FINAL:
                break;
        }
    }

    createTable() {
        const allStates = this.input1.states.concat(this.input2.states)
        for (let i = 0; i < allStates.length; i++){
            let state1 = allStates[i];
            for (let j = i + 1; j < allStates.length; j++){
                let state2 = allStates[j];
                this.pairs.set([state1, state2], "")
            }
        }
        this.state = TableFillingAlgorithmState.EMPTY_TABLE
    }

    initializeTable() {
        const acceptingStates = new Set([...this.input1.finalStates, ...this.input2.finalStates])
        for (let pair of this.pairs.keys()) {
            if (acceptingStates.has(pair[0]) !== acceptingStates.has(pair[1])) {
                this.pairs.set(pair, "X")
            }
        }
        this.state = TableFillingAlgorithmState.ACCEPTING_PAIRS_DISTINGUISHED
    }

    markPairs() {}

    state: TableFillingAlgorithmState;
}