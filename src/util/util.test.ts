import { dfaA } from "../algorithm/data/exampleData";
import { serializeDfa, deserializeDfa } from "./util";

it("should serialize and deserialize DFAs correctly", function () {
    const serialized = serializeDfa(dfaA);
    const serializedString = JSON.stringify(serialized);
    const deserializedString = JSON.parse(serializedString);
    const deserialized = deserializeDfa(deserializedString);
    expect(deserialized).toEqual(dfaA);
});
