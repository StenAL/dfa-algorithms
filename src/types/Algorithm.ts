import { TableFillingAlgorithmState } from "../algorithm/TableFillingAlgorithm";

export interface Algorithm {
    type: AlgorithmType;
    state: AlgorithmState;
    step: () => void;
    reset: () => void;
    log?: Log;
    produceWitness: boolean;
    witness: string;
}

export interface Log {
    log: (message: string) => void;
    clear: () => void;
}

export type AlgorithmType = "table-filling" | "hopcroft" | "other";

export enum EquivalenceTestingResult {
    NOT_AVAILABLE,
    EQUIVALENT,
    NON_EQUIVALENT,
}

export enum CommonAlgorithmState {
    INITIAL = 1000,
    FINAL,
}

export type AlgorithmState = TableFillingAlgorithmState | CommonAlgorithmState;

export enum AlgorithmMode {
    EQUIVALENCE_TESTING,
    STATE_MINIMIZATION,
}
