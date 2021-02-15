import { dfaA } from "./data/exampleData";
import TableFillingAlgorithm from "./TableFillingAlgorithm";

const algo = new TableFillingAlgorithm(dfaA);
algo.log = { log: console.log, clear: () => {} };
algo.run();
console.log(algo.result);
