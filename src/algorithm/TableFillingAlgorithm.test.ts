import { CommonAlgorithmState, EquivalenceTestingResult } from "../types/Algorithm";
import { DFA } from "../types/DFA";
import { getPrettyDfaString } from "../util/util";
import { preGeneratedDatasets } from "./data/datasets";
import { minimizedLinear, minimizedSprawling } from "./Minimizer.test";
import { TableFillingAlgorithmImpl, TableFillingAlgorithmState } from "./TableFillingAlgorithm";

it("equivalence testing works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new TableFillingAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    algorithm = new TableFillingAlgorithmImpl(data[1]!, data[0]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    data = preGeneratedDatasets.random;
    algorithm = new TableFillingAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    data = preGeneratedDatasets.sprawling;
    algorithm = new TableFillingAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);

    data = preGeneratedDatasets.linear;
    algorithm = new TableFillingAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);
});

it("witness mode works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new TableFillingAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("011");

    data = preGeneratedDatasets.random;
    algorithm = new TableFillingAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("10");

    data = preGeneratedDatasets.sprawling;
    algorithm = new TableFillingAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);

    data = preGeneratedDatasets.linear;
    algorithm = new TableFillingAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);
});

it("state minimization works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new TableFillingAlgorithmImpl(data[0]);
    algorithm.run();
    expect(algorithm.result).toEqual(data[0]);

    data = preGeneratedDatasets.random;
    algorithm = new TableFillingAlgorithmImpl(data[0]);
    algorithm.run();
    expect(algorithm.result).toEqual(data[0]);

    data = preGeneratedDatasets.sprawling;
    algorithm = new TableFillingAlgorithmImpl(data[0]);
    algorithm.run();
    expect(algorithm.result).toEqual(minimizedSprawling);

    data = preGeneratedDatasets.linear;
    algorithm = new TableFillingAlgorithmImpl(data[0]);
    algorithm.run();
    expect(getPrettyDfaString(algorithm.result as DFA)).toEqual(
        getPrettyDfaString(minimizedLinear)
    );
});

it("steps change state as expected", function () {
    const data = preGeneratedDatasets.example;

    const algorithm = new TableFillingAlgorithmImpl(data[0], data[1], true);
    algorithm.log = { log: jest.fn(), clear: jest.fn() };
    expect(algorithm.state).toBe(CommonAlgorithmState.INITIAL);
    expect(algorithm.pairs.count()).toBe(0);
    expect(algorithm.unmarkedPairs.count()).toBe(0);

    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.EMPTY_TABLE);
    expect(algorithm.pairs.count()).toBe(28);
    expect(algorithm.pairs.values().every((value) => value === "")).toBe(true);
    expect(algorithm.unmarkedPairs.count()).toBe(algorithm.pairs.count());

    algorithm.step();
    const finalStates = new Set([...data[0].finalStates, ...data[1]!.finalStates]);
    expect(algorithm.state).toBe(TableFillingAlgorithmState.MARKING_PAIRS);
    const pairsOfFinalAndNonFinalStates = algorithm.pairs
        .entries()
        .filter(([pair, _value]) => finalStates.has(pair[0]) !== finalStates.has(pair[1]));
    expect(pairsOfFinalAndNonFinalStates.every(([_pair, value]) => value !== "")).toBe(true);
    expect(algorithm.unmarkedPairs.count()).toBe(
        algorithm.pairs.count() - pairsOfFinalAndNonFinalStates.length
    );

    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.MARKING_PAIRS);
    expect(algorithm.unmarkedPairs.count()).toBe(7);

    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.MARKING_PAIRS);
    expect(algorithm.unmarkedPairs.count()).toBe(2);

    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.MARKING_PAIRS);
    expect(algorithm.unmarkedPairs.count()).toBe(1);

    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.ALL_PAIRS_MARKED);
    expect(algorithm.unmarkedPairs.count()).toBe(1);
    expect(algorithm.result).toBe(EquivalenceTestingResult.NOT_AVAILABLE);

    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.CONSTRUCTING_WITNESS);
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("");

    algorithm.step();
    expect(algorithm.state).toBe(CommonAlgorithmState.FINAL);
    expect(algorithm.witness).toBe("011");

    algorithm.step();
    expect(algorithm.state).toBe(CommonAlgorithmState.FINAL);
    expect(algorithm.witness).toBe("011");

    algorithm.reset();
    expect(algorithm.state).toBe(CommonAlgorithmState.INITIAL);
    expect(algorithm.pairs.count()).toBe(0);
    expect(algorithm.unmarkedPairs.count()).toBe(0);
});
