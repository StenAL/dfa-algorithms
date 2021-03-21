// eslint-disable

// import { sprawlingDatasetGenerator } from "./data/datasetGenerator";
//
// sprawlingDatasetGenerator(20, ["a", "b", "c"], 5);

import * as fs from "fs";
import { DFA } from "../types/DFA";
import { deserializeDfa, getPrettyDfaString, serializeDfa } from "../util/util";
import {
    linearDatasetGenerator,
    sprawlingDatasetGenerator,
    deBruijnDatasetGenerator,
    randomDatasetGenerator,
} from "./data/datasetGenerator";
import { HopcroftAlgorithmImpl } from "./HopcroftAlgorithm";
import { NearlyLinearAlgorithmImpl } from "./NearlyLinearAlgorithm";
import { TableFillingAlgorithmImpl } from "./TableFillingAlgorithm";

const states = 32;
const finalStates = 16;
const generator = deBruijnDatasetGenerator;
const dfaA = generator(states, ["0", "1"], finalStates, "q");
const dfaB = generator(states, ["0", "1"], finalStates, "p");

// fs.writeFileSync("src/algorithm/random32768A.txt", JSON.stringify(serializeDfa(dfaA)));
// fs.writeFileSync("src/algorithm/random32768B.txt", JSON.stringify(serializeDfa(dfaB)));

// const fileA = fs.readFileSync("src/algorithm/random32768A.txt", "utf-8");
// const dfaA: DFA = deserializeDfa(JSON.parse(fileA));
//
// const fileB = fs.readFileSync("src/algorithm/random32768B.txt", "utf-8");
// const dfaB: DFA = deserializeDfa(JSON.parse(fileB));

const iterations = 50;
const witness = false;
for (let i = 0; i < iterations; i++) {
    const algorithm = new NearlyLinearAlgorithmImpl(dfaA, dfaB, witness);
    // algorithm.log = {clear: () => {}, log: console.log}
    console.time("algo");
    algorithm.run();
    console.timeEnd("algo");
}
