import { HopcroftAlgorithmState } from "../algorithm/HopcroftAlgorithm";
import { TableFillingAlgorithmState } from "../algorithm/TableFillingAlgorithm";
import { DFA } from "./DFA";

export interface Algorithm {
    type: AlgorithmType;
    state: AlgorithmState;
    run: () => void;
    step: () => void;
    reset: () => void;
    log?: Log;

    input1: DFA;
    input2?: DFA;

    mode: AlgorithmMode;
    produceWitness: boolean;
    witness: string;
    result: EquivalenceTestingResult | DFA;
}

export interface Log {
    log: (message: string) => void;
    clear: () => void;
}

export type AlgorithmType =
    | "tableFilling"
    | "tableFillingWitness"
    | "hopcroft"
    | "hopcroftWitness"
    | "nearlyLinear"
    | "nearlyLinearWitness";

export type AlgorithmsSelected = {
    [type in AlgorithmType]: boolean;
};

export enum EquivalenceTestingResult {
    NOT_AVAILABLE,
    EQUIVALENT,
    NON_EQUIVALENT,
}

export enum CommonAlgorithmState {
    INITIAL = 1000,
    FINAL,
}

export type AlgorithmState =
    | TableFillingAlgorithmState
    | HopcroftAlgorithmState
    | CommonAlgorithmState;

export enum AlgorithmMode {
    EQUIVALENCE_TESTING,
    STATE_MINIMIZATION,
}
