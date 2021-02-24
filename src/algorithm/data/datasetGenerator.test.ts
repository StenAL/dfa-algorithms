import { State } from "../../types/DFA";
import Queue from "mnemonist/queue";
import { randomDatasetGenerator, sprawlingDatasetGenerator } from "./datasetGenerator";

it("random dataset forms connected graph", function () {
    const dfa = randomDatasetGenerator(10, ["0", "1"], 5, "test");
    expect(dfa.states.map((s) => s.name).every((name) => name.startsWith("test"))).toBe(true);
    expect(dfa.states.length).toBe(10);
    expect(dfa.finalStates.size).toBe(5);
    const visited = new Set();
    const queue = [dfa.startingState];
    while (queue.length > 0) {
        const currentState = queue.pop()!;
        if (visited.has(currentState)) {
            continue;
        }

        const transitionTo = Array.from(currentState.transitions.values()).flat();
        visited.add(currentState);
        queue.push(...transitionTo);
    }
    expect(visited.size).toBe(dfa.states.length);
});

it("sprawling dataset is connected, assigns final states correctly", function () {
    const alphabet = ["a", "b", "c"];
    const statesCount = 50;
    const finalStatesCount = 10;
    const dfa = sprawlingDatasetGenerator(statesCount, alphabet, finalStatesCount);
    const transitionsToNewStatesCount = [];
    for (let state of dfa.states) {
        transitionsToNewStatesCount.push(
            Array.from(state.transitions.values()).filter((value) => value !== state).length
        );
    }
    expect(transitionsToNewStatesCount.filter((count) => count === alphabet.length).length).toBe(
        Math.floor(statesCount / alphabet.length)
    );
    expect(
        transitionsToNewStatesCount.filter((count) => ![0, alphabet.length].includes(count)).length
    ).toBe(statesCount % alphabet.length === 0 ? 0 : 1);
    expect(transitionsToNewStatesCount.filter((count) => count === 0).length).toBe(
        statesCount - Math.ceil(statesCount / alphabet.length)
    );

    const queue = new Queue<State>();
    queue.enqueue(dfa.startingState);
    const traversal = [];
    while (queue.size !== 0) {
        const s = queue.dequeue()!;
        traversal.push(s);
        Array.from(s.transitions.values())
            .filter((v) => v !== s)
            .forEach((s) => queue.enqueue(s));
    }
    const expectedFinalStates = traversal.slice(statesCount - finalStatesCount);
    for (let expectedFinalState of expectedFinalStates) {
        expect(dfa.finalStates.has(expectedFinalState)).toBe(true);
    }
});
