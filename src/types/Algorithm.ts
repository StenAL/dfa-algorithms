import { TableFillingAlgorithmState } from "../algorithm/TableFillingAlgorithm";

export interface Algorithm {
    type: AlgorithmType;
    state: AlgorithmState;
    step: () => void;
    reset: () => void;
    log?: (message: string) => void;
}

export type AlgorithmType = "table-filling" | "hopcroft" | "other";

export enum EquivalenceTestingResult {
    UNFINISHED,
    EQUIVALENT,
    NON_EQUIVALENT,
}

export enum CommonAlgorithmState {
    INITIAL= 1000,
    FINAL
}

export type AlgorithmState = TableFillingAlgorithmState | CommonAlgorithmState;

export enum AlgorithmMode {
    EQUIVALENCE_TESTING,
    MINIMIZATION,
}