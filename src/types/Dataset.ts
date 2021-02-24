import { DFA } from "./DFA";

export enum DatasetType {
    RANDOM,
    SPRAWLING,
}

export type DatasetGenerator = (
    statesCount: number,
    alphabet: string[],
    finalStatesCount: number,
    statePrefix?: string
) => DFA;
