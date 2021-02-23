// eslint-disable no-unused-vars

import { dfaA, dfaB } from "./data/exampleData";
import { NearlyLinearAlgorithmImpl } from "./NearlyLinearAlgorithm";

const algo = new NearlyLinearAlgorithmImpl(dfaA, dfaB);
algo.log = { log: console.log, clear: () => {} };

algo.step();
algo.step();
algo.step();
algo.step();
algo.step();
algo.step();
algo.step();
algo.step();
