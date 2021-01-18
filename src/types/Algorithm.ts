import {TableFillingAlgorithmState} from "../algorithm/TableFillingAlgorithm";

export interface Algorithm {
    state: AlgorithmState
    step: () => void
}

export type AlgorithmState = TableFillingAlgorithmState