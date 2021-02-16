import HashMap from "hashmap";
import { dfaA, dfaB } from "./data/exampleData";
import HopcroftAlgorithm from "./HopcroftAlgorithm";
import TableFillingAlgorithm from "./TableFillingAlgorithm";

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
console.log(algo.result);

// const a = new HashMap<string, string>()
// console.log(a.get("abc"));

const a = new Set<string>();
a.forEach((v) => console.log(v));
