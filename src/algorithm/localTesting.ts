// eslint-disable

// import { sprawlingDatasetGenerator } from "./data/datasetGenerator";
//
// sprawlingDatasetGenerator(20, ["a", "b", "c"], 5);

import * as fs from "fs";
import { DFA } from "../types/DFA";
import { deserializeDfa, getPrettyDfaString, serializeDfa } from "../util/util";
import {
    linearDatasetGenerator,
    randomDatasetGenerator,
    sprawlingDatasetGenerator,
} from "./data/datasetGenerator";
import { HopcroftAlgorithmImpl } from "./HopcroftAlgorithm";
import { NearlyLinearAlgorithmImpl } from "./NearlyLinearAlgorithm";
import { TableFillingAlgorithmImpl } from "./TableFillingAlgorithm";

const dfaA = linearDatasetGenerator(100, ["0", "1"], 10, "q");
const dfaB = linearDatasetGenerator(100, ["0", "1"], 10, "p");
//
// const serializedA = serializeDfa(dfaA);
// const serializedB = serializeDfa(dfaB);
// fs.writeFile("src/algorithm/randomA.txt", JSON.stringify(serializedA), () => {});
// fs.writeFile("src/algorithm/randomB.txt", JSON.stringify(serializedB), () => {});

// const fileA = fs.readFileSync("src/algorithm/randomA.txt", "utf-8");
// const dfaA: DFA = deserializeDfa(JSON.parse(fileA));
//
// const fileB = fs.readFileSync("src/algorithm/randomB.txt", "utf-8");
// const dfaB: DFA = deserializeDfa(JSON.parse(fileB));

const iterations = 5;
for (let i = 0; i < iterations; i++) {
    const algorithm = new TableFillingAlgorithmImpl(dfaA, dfaB);
    console.time("algo");
    algorithm.run();
    console.timeEnd("algo");
}
