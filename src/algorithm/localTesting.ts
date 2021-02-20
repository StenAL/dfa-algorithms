// eslint-disable no-unused-vars

import { deserializeDfa, serializeDfa } from "../util/util";
import { dfaA, dfaB } from "./data/exampleData";
import HopcroftAlgorithm from "./HopcroftAlgorithm";

// const algo = new TableFillingAlgorithm(dfaA);
// algo.log = { log: console.log, clear: () => {} };
// algo.run();
// console.log(algo.result);

const algo = new HopcroftAlgorithm(dfaA, dfaB);
algo.log = {
    log: console.log,
    clear: () => {},
};
// algo.step();
// algo.step();
// algo.step();
// algo.step();
// algo.step();
// algo.step();
// algo.run();

const serialized = serializeDfa(dfaA);

const dfa = deserializeDfa(serialized);
console.log(dfa);
