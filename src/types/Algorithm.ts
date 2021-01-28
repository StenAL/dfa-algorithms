import {TableFillingAlgorithmState} from "../algorithm/TableFillingAlgorithm";

export interface Algorithm {
    type: "table-filling" | "other";
    state: AlgorithmState
    step: () => void
}

export enum EquivalenceTestingResult {
    UNFINISHED, EQUIVALENT, NON_EQUIVALENT
}

export type AlgorithmState = TableFillingAlgorithmState