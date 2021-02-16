// eslint-disable no-unused-vars
import { dfaA, dfaB } from "./data/exampleData";
import HopcroftAlgorithm from "./HopcroftAlgorithm";

// const algo = new TableFillingAlgorithm(dfaA);
// algo.log = { log: console.log, clear: () => {} };
// algo.run();
// console.log(algo.result);

const algo = new HopcroftAlgorithm(dfaA, dfaB);
algo.log = { log: console.log, clear: () => {} };
// algo.step();
// algo.step();
// algo.step();
// algo.step();
// algo.step();
// algo.step();
algo.run();

// const a = new HashMap<string, string>()
// console.log(a.get("abc"));
