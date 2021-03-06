import { CommonAlgorithmState, EquivalenceTestingResult } from "../types/Algorithm";
import { DFA, State } from "../types/DFA";
import { preGeneratedDatasets } from "./data/datasets";
import { exampleDfa1 } from "./data/exampleData";
import { NearlyLinearAlgorithmImpl, NearlyLinearAlgorithmState } from "./NearlyLinearAlgorithm";

it("equivalence testing works on pre-generated data", function () {
    let data = preGeneratedDatasets.example;
    let algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!);
    algorithm.log = { log: jest.fn(), clear: jest.fn() };
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);

    algorithm = new NearlyLinearAlgorithmImpl(data[1]!, data[0]);
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

it("steps change state as expected", function () {
    const data = preGeneratedDatasets.example;

    const algorithm = new NearlyLinearAlgorithmImpl(data[0], data[1]!, true);
    algorithm.log = { log: jest.fn(), clear: jest.fn() };
    expect(algorithm.sets.dimension).toBe(0);
    expect(algorithm.processingQueue.size).toBe(0);

    algorithm.step();
    expect(algorithm.state).toBe(NearlyLinearAlgorithmState.SETS_INITIALIZED);
    expect(algorithm.sets.dimension).toBe(8);

    algorithm.step();
    expect(algorithm.state).toBe(NearlyLinearAlgorithmState.COMBINING_SETS);
    expect(algorithm.sets.dimension).toBe(7);
    expect(
        algorithm.sets
            .compile()
            .some(
                (set) =>
                    set.includes(algorithm.stateToIndex.get(data[0].startingState)!) &&
                    set.includes(algorithm.stateToIndex.get(data[1]!.startingState)!)
            )
    ).toBe(true);
    expect(Array.from(algorithm.processingQueue)).toEqual([
        [data[0].startingState, data[1]!.startingState],
    ]);

    algorithm.step();
    expect(algorithm.state).toBe(NearlyLinearAlgorithmState.COMBINING_SETS);
    expect(algorithm.sets.dimension).toBe(5);
    expect(algorithm.processingQueue.size).toBe(2);

    algorithm.step();
    expect(algorithm.state).toBe(NearlyLinearAlgorithmState.COMBINING_SETS);
    expect(algorithm.sets.dimension).toBe(4);
    expect(algorithm.processingQueue.size).toBe(2);

    algorithm.step();
    expect(algorithm.state).toBe(NearlyLinearAlgorithmState.COMBINING_SETS);
    expect(algorithm.sets.dimension).toBe(4);
    expect(algorithm.processingQueue.size).toBe(1);
    expect(algorithm.result).toBe(EquivalenceTestingResult.NOT_AVAILABLE);

    algorithm.step();
    expect(algorithm.state).toBe(NearlyLinearAlgorithmState.CONSTRUCTING_WITNESS);
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.sets.dimension).toBe(3);
    expect(algorithm.witness).toBe("");

    algorithm.step();
    expect(algorithm.state).toBe(CommonAlgorithmState.FINAL);
    expect(algorithm.witness).toBe("011");

    algorithm.step();
    expect(algorithm.state).toBe(CommonAlgorithmState.FINAL);
    expect(algorithm.witness).toBe("011");

    algorithm.reset();
    expect(algorithm.state).toBe(CommonAlgorithmState.INITIAL);
    expect(algorithm.sets.dimension).toBe(0);
    expect(algorithm.processingQueue.size).toBe(0);
});

it("exits early when one of initial states is accepting and other is not", function () {
    const p0: State = { name: "p0", transitions: new Map<string, State>() };
    const logMock = jest.fn();
    const alwaysAccept: DFA = {
        startingState: p0,
        alphabet: ["0", "1"],
        states: [p0],
        finalStates: new Set<State>([p0]),
    };
    let algorithm = new NearlyLinearAlgorithmImpl(exampleDfa1, alwaysAccept, true);
    algorithm.log = { log: logMock, clear: jest.fn() };
    algorithm.run();
    expect(algorithm.result).toBe(EquivalenceTestingResult.NON_EQUIVALENT);
    expect(algorithm.witness).toBe("");
    expect(logMock.mock.calls.some((s) => (s[0] as string).includes("empty string"))).toBe(true);
    expect(algorithm.sets.dimension).toBe(
        exampleDfa1.states.length + alwaysAccept.states.length - 1
    );
    expect(algorithm.processingQueue.size).toBe(0);
});
