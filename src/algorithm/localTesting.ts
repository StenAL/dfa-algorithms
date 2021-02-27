// eslint-disable

// import { sprawlingDatasetGenerator } from "./data/datasetGenerator";
//
// sprawlingDatasetGenerator(20, ["a", "b", "c"], 5);

import { getPrettyDfaString } from "../util/util";
import { linearDatasetGenerator } from "./data/datasetGenerator";
import { exampleDfa1, exampleDfa2 } from "./data/exampleData";
import { TableFillingAlgorithmImpl } from "./TableFillingAlgorithm";

const a = linearDatasetGenerator(10, ["0", "1"], 1);
const b = new TableFillingAlgorithmImpl(a);
b.run();
// console.log(b)
