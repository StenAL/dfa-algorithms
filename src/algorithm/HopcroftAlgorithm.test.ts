import _ from "lodash";
import { CommonAlgorithmState, EquivalenceTestingResult } from "../types/Algorithm";
import { DFA } from "../types/DFA";
import { getPrettyDfaString } from "../util/util";
import { preGeneratedDatasets } from "./data/datasets";
import { HopcroftAlgorithmImpl, HopcroftAlgorithmState } from "./HopcroftAlgorithm";
import { minimizedLinear, minimizedSprawling } from "./Minimizer.test";

it("equivalence testing works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new HopcroftAlgorithmImpl(data[0], data[1]);
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    algorithm = new HopcroftAlgorithmImpl(data[1]!, data[0]);
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
    algorithm.log = { log: jest.fn(), clear: jest.fn() };
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

it("steps change state as expected", function () {
    const data = preGeneratedDatasets.example;

    const algorithm = new HopcroftAlgorithmImpl(data[0], data[1], true);
    algorithm.log = { log: jest.fn(), clear: jest.fn() };
    expect(algorithm.state).toBe(CommonAlgorithmState.INITIAL);
    expect(algorithm.witnessTable.count()).toBe(0);
    expect(algorithm.inverseTransitionFunction.count()).toBe(0);
    expect(algorithm.blocks.size).toBe(0);
    expect(algorithm.statesWithPredecessors.count()).toBe(0);
    expect(algorithm.toDoLists.size).toBe(0);

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED);
    expect(algorithm.witnessTable.count()).toBe(data[0].states.length * data[1]!.states.length);
    expect(algorithm.witnessTable.values().every((v) => v === "")).toBe(true);
    expect(algorithm.inverseTransitionFunction.entries().length).toBe(8);

    algorithm.step();
    const finalStates = new Set([...data[0].finalStates, ...data[1]!.finalStates]);
    const nonFinalStates = data[0].states
        .concat(data[1]!.states)
        .filter((s) => !finalStates.has(s));
    expect(algorithm.state).toBe(HopcroftAlgorithmState.INITIAL_PARTITIONS_CREATED);
    expect(algorithm.blocks.size).toBe(2);
    expect(Array.from(finalStates).every((s) => algorithm.blocks.get(1)!.has(s))).toBe(true);
    expect(Array.from(nonFinalStates).every((s) => algorithm.blocks.get(2)!.has(s))).toBe(true);

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED);
    expect(algorithm.statesWithPredecessors.count()).toBe(4);
    expect(algorithm.statesWithPredecessors.get(["0", 1])!.size).toBe(0);
    expect(algorithm.statesWithPredecessors.get(["0", 2])!.size).toBe(4);
    expect(algorithm.statesWithPredecessors.get(["1", 1])!.size).toBe(2);
    expect(algorithm.statesWithPredecessors.get(["1", 2])!.size).toBe(2);

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.toDoLists.size).toBe(2);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([1]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([1]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(2);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set());
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([1]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(4);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([2, 4]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([3, 1]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(5);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([4, 5]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([3, 1, 5]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(5);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([5]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([3, 1, 5]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(5);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([3, 1, 5]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(5);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([1, 5]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(6);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([6]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([5, 6]));

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    expect(algorithm.blocks.size).toBe(7);
    expect(algorithm.toDoLists.get("0")).toEqual(new Set([7]));
    expect(algorithm.toDoLists.get("1")).toEqual(new Set([5, 6, 7]));

    algorithm.step();
    algorithm.step();
    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.PARTITIONING_BLOCKS);
    algorithm.step();
    expect(algorithm.blocks.size).toBe(7);
    expect(algorithm.state).toBe(HopcroftAlgorithmState.ALL_BLOCKS_PARTITIONED);
    expect(algorithm.result).toBe(EquivalenceTestingResult.NOT_AVAILABLE);

    algorithm.step();
    expect(algorithm.state).toBe(HopcroftAlgorithmState.CONSTRUCTING_WITNESS);
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
    expect(algorithm.witnessTable.count()).toBe(0);
    expect(algorithm.inverseTransitionFunction.count()).toBe(0);
    expect(algorithm.blocks.size).toBe(0);
    expect(algorithm.statesWithPredecessors.count()).toBe(0);
    expect(algorithm.toDoLists.size).toBe(0);
});
