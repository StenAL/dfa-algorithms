import { EquivalenceTestingResult } from "../types/Algorithm";
import { preGeneratedDatasets } from "./data/datasets";
import { minimizedSprawling } from "./Minimizer.test";
import { TableFillingAlgorithmImpl } from "./TableFillingAlgorithm";

it("equivalence testing works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new TableFillingAlgorithmImpl(data[0], data[1]);
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
});
