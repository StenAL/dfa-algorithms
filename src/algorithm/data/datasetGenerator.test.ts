import { randomDatasetGenerator } from "./datasetGenerator";

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
