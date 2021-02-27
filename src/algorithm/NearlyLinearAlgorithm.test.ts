import { EquivalenceTestingResult } from "../types/Algorithm";
import { preGeneratedDatasets } from "./data/datasets";
import { NearlyLinearAlgorithmImpl } from "./NearlyLinearAlgorithm";

it("equivalence testing works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    data = preGeneratedDatasets.random;
    algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    data = preGeneratedDatasets.sprawling;
    algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);

    data = preGeneratedDatasets.linear;
    algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);
});

it("witness mode works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!, true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("011");

    data = preGeneratedDatasets.random;
    algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!, true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("01");

    data = preGeneratedDatasets.sprawling;
    algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!, true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);

    data = preGeneratedDatasets.linear;
    algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!, true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);
});
