import { dfaA } from "../algorithm/data/exampleData";
import { serializeDfa, deserializeDfa, getPrettyDfaString } from "./util";

it("should serialize and deserialize DFAs correctly", function () {
    const serialized = serializeDfa(dfaA);
    const serializedString = JSON.stringify(serialized);
    const deserializedString = JSON.parse(serializedString);
    const deserialized = deserializeDfa(deserializedString);
    expect(deserialized).toEqual(dfaA);
});

it("generates correct number of messages for pretty printing", function () {
    const transitionMessagesCount = dfaA.states
        .map((s) => s.transitions)
        .map((transitions) => Array.from(transitions.entries()))
        .flat().length;
    expect(getPrettyDfaString(dfaA).length).toBe(1 + 1 + transitionMessagesCount);
});
