import { DFA } from "./DFA";

export enum DatasetType {
    RANDOM,
    SPRAWLING,
    LINEAR,
    DE_BRUIJN,
}

export type PreGeneratedDatasetName = "example" | "random" | "sprawling" | "linear" | "deBruijn";

export type DatasetGenerator = (
    statesCount: number,
    alphabet: string[],
    finalStatesCount: number,
    statePrefix?: string
) => DFA;

export type PreGeneratedDataset = [DFA, DFA | undefined];

export type PreGeneratedDatasets = {
    [type in PreGeneratedDatasetName]: PreGeneratedDataset;
};
