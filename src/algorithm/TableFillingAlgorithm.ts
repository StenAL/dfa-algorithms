import {DFA, State} from "../types/DFA";
import {Algorithm} from "../types/Algorithm";

export enum TableFillingAlgorithmState {
    INITIAL,
    EMPTY_TABLE,
    TABLE_COMPLETE,
    FINAL
}

interface TableFillingAlgorithmInterface extends Algorithm {
    input1: DFA;
    input2: DFA;
    pairs: Map<[State, State], string>;

}

export default class TableFillingAlgorithm implements TableFillingAlgorithmInterface {
    input1: DFA;
    input2: DFA;
    pairs: Map<[State, State], string>;

    constructor(input1: DFA, input2: DFA) {
        this.state = TableFillingAlgorithmState.INITIAL
        this.input1 = input1
        this.input2 = input2
        this.pairs = new Map()
    }

    step() {
        switch (this.state) {
            case TableFillingAlgorithmState.INITIAL:
                this.createTable();
                break;
            case TableFillingAlgorithmState.EMPTY_TABLE:
                break;
            case TableFillingAlgorithmState.TABLE_COMPLETE:
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
        console.log(this.pairs)
    }

    initializeTable() {

    }

    state: TableFillingAlgorithmState;
}