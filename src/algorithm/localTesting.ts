// eslint-disable no-unused-vars

import { DatasetType } from "../types/Dataset";
import { getPrettyDfaString } from "../util/util";
import { randomDatasetGenerator } from "./data/datasetGenerator";

const dfa = randomDatasetGenerator(5, ["0", "1"], 1);
getPrettyDfaString(dfa);

Object.keys(DatasetType)
    .filter((k) => !isNaN(parseInt(k)))
    .map((k) => console.log(k));

console.log(Object.values(DatasetType));
