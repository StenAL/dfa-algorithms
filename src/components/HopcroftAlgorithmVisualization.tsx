import HopcroftAlgorithm from "../algorithm/HopcroftAlgorithm";

interface HopcroftAlgorithmVisualizationProps {
    algorithm: HopcroftAlgorithm;
}

export default function HopcroftAlgorithmVisualization({
    algorithm,
}: HopcroftAlgorithmVisualizationProps) {
    const partitions = Array.from(algorithm.blocks.entries())
        .map(([number, states]) => {
            return `${number}: {${Array.from(states)
                .map((s) => s.name)
                .join(", ")}}`;
        })
        .map((p) => <p>{p}</p>);
    const statesWithPredecessors = Array.from(algorithm.statesWithPredecessors.entries())
        .map(([[symbol, blockNumber], states]) => {
            return `(${symbol},${blockNumber}): {${Array.from(states)
                .map((s) => s.name)
                .join(", ")}}`;
        })
        .map((p) => <p>{p}</p>);

    const toDoLists = Array.from(algorithm.toDoLists.entries())
        .map(([symbol, blockNumbers]) => `${symbol}: {${Array.from(blockNumbers).join(", ")}}`)
        .map((p) => <p>{p}</p>);
    return (
        <div>
            {algorithm.blocks.size > 0 ? (
                <>
                    <h3>Partitions</h3>
                    {partitions}
                </>
            ) : (
                ""
            )}
            {algorithm.toDoLists.size > 0 ? (
                <>
                    <h3>States with predecessors by block</h3>
                    <p>
                        {
                            "(symbol s, block number i): {states in block i that have predecessors on symbol s}"
                        }
                    </p>
                    {statesWithPredecessors}
                </>
            ) : (
                ""
            )}
            {algorithm.toDoLists.size > 0 ? (
                <>
                    <h3>To-do lists</h3>
                    {toDoLists}
                </>
            ) : (
                ""
            )}
        </div>
    );
}
