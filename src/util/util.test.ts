import { exampleDfa1 } from "../algorithm/data/exampleData";
import { serializeDfa, deserializeDfa, getPrettyDfaString } from "./util";

it("should serialize and deserialize DFAs correctly", function () {
    const serialized = serializeDfa(exampleDfa1);
    const serializedString = JSON.stringify(serialized);
    const deserializedString = JSON.parse(serializedString);
    const deserialized = deserializeDfa(deserializedString);
    expect(deserialized).toEqual(exampleDfa1);
});

it("generates correct number of messages for pretty printing", function () {
    const transitionMessagesCount = exampleDfa1.states
        .map((s) => s.transitions)
        .map((transitions) => Array.from(transitions.entries()))
        .flat().length;
    expect(getPrettyDfaString(exampleDfa1).length).toBe(1 + 1 + transitionMessagesCount);
});
