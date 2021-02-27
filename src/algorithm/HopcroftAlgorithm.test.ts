import _ from "lodash";
import { EquivalenceTestingResult } from "../types/Algorithm";
import { DFA } from "../types/DFA";
import { getPrettyDfaString } from "../util/util";
import { preGeneratedDatasets } from "./data/datasets";
import { HopcroftAlgorithmImpl } from "./HopcroftAlgorithm";
import { minimizedLinear, minimizedSprawling } from "./Minimizer.test";

it("equivalence testing works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new HopcroftAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    data = preGeneratedDatasets.random;
    algorithm = new HopcroftAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    data = preGeneratedDatasets.sprawling;
    algorithm = new HopcroftAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);

    data = preGeneratedDatasets.linear;
    algorithm = new HopcroftAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);
});

it("witness mode works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new HopcroftAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("011");

    data = preGeneratedDatasets.random;
    algorithm = new HopcroftAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("000000000");

    data = preGeneratedDatasets.sprawling;
    algorithm = new HopcroftAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);

    data = preGeneratedDatasets.linear;
    algorithm = new HopcroftAlgorithmImpl(data[0], data[1], true);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.EQUIVALENT);
});

it("state minimization works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new HopcroftAlgorithmImpl(data[0]);
    algorithm.run();
    expect(algorithm.result).toEqual(data[0]);

    data = preGeneratedDatasets.random;
    algorithm = new HopcroftAlgorithmImpl(data[0]);
    algorithm.run();
    expect(algorithm.result).toEqual(data[0]);

    data = preGeneratedDatasets.sprawling;
    algorithm = new HopcroftAlgorithmImpl(data[0]);
    algorithm.run();

    const minimizedSprawlingCopy = _.clone(minimizedSprawling);
    minimizedSprawlingCopy.states[6].name = "{q29,q28,q27}";
    expect(algorithm.result).toEqual(minimizedSprawlingCopy);

    data = preGeneratedDatasets.linear;
    algorithm = new HopcroftAlgorithmImpl(data[0]);
    algorithm.run();

    const minimizedLinearCopy = _.clone(minimizedLinear);
    minimizedLinearCopy.states[minimizedLinearCopy.states.length - 1].name = "{q29,q28,q27}";
    expect(getPrettyDfaString(algorithm.result as DFA)).toEqual(
        getPrettyDfaString(minimizedLinearCopy)
    );
});
