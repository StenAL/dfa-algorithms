import {
    NearlyLinearAlgorithm,
    NearlyLinearAlgorithmState,
} from "../../algorithm/NearlyLinearAlgorithm";
import { CommonAlgorithmState, EquivalenceTestingResult } from "../../types/Algorithm";

interface NearlyLinearAlgorithmVisualizationProps {
    algorithm: NearlyLinearAlgorithm;
}

export default function NearlyLinearAlgorithmVisualization({
    algorithm,
}: NearlyLinearAlgorithmVisualizationProps) {
    const renderSets = algorithm.state !== CommonAlgorithmState.INITIAL;
    const sets = renderSets ? (
        <div className={"visualization-table nearly-linear-sets"}>
            <div className={"table-row"} key={`sets-header`}>
                <div className={"visualization-header"}>Representative</div>
                <div className={"visualization-cell"}>Set</div>
            </div>
            {algorithm.sets.compile().map((set) => {
                const representative = algorithm.indexToState.get(algorithm.sets.find(set[0]))!;
                return (
                    <div className={"table-row"} key={`sets-${representative.name}`}>
                        <div className={"visualization-header"}>{representative.name}</div>
                        <div className={"visualization-cell"}>
                            {"{" +
                                set
                                    .map((index) => algorithm.indexToState.get(index)!)
                                    .map((s) => s.name)
                                    .join(", ") +
                                "}"}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        ""
    );

    const renderProcessingStack =
        algorithm.state === NearlyLinearAlgorithmState.COMBINING_SETS ||
        algorithm.state === NearlyLinearAlgorithmState.ALL_SETS_COMBINED;
    const processingStack = renderProcessingStack ? (
        <div className={"nearly-linear-stack"}>
            {Array.from(algorithm.processingStack).map(([p, q]) => (
                <div key={`stack-${p.name}-${q.name}`}>
                    ({p.name},{q.name})
                </div>
            ))}
        </div>
    ) : (
        ""
    );

    let stateDescription = "";
    switch (algorithm.state) {
        case CommonAlgorithmState.INITIAL:
            stateDescription = "Initial state";
            break;
        case NearlyLinearAlgorithmState.SETS_INITIALIZED:
            stateDescription = "Sets initialized";
            break;
        case NearlyLinearAlgorithmState.COMBINING_SETS:
            stateDescription = "Combining sets";
            break;
        case NearlyLinearAlgorithmState.ALL_SETS_COMBINED:
            stateDescription = "All eligible sets combined";
            break;

        case CommonAlgorithmState.FINAL:
            stateDescription = "Final state";
            let resultString =
                "DFAs are " +
                (algorithm.result === EquivalenceTestingResult.EQUIVALENT
                    ? " equivalent"
                    : "non-equivalent");
            if (
                algorithm.result === EquivalenceTestingResult.NON_EQUIVALENT &&
                algorithm.produceWitness
            ) {
                resultString += `. Witness: ${algorithm.witness}.`;
            }
            // todo output link to or JSON of minimized DFA somewhere here
            // const result: DFA = algorithm.result as DFA;
            stateDescription += ". " + resultString;
            break;
    }

    return (
        <>
            <p>Current state: {stateDescription}</p>
            {renderSets ? (
                <>
                    <h3>Sets</h3>
                    {sets}
                </>
            ) : (
                ""
            )}
            {renderProcessingStack ? (
                <>
                    <h3>Processing Stack</h3>
                    {processingStack}
                </>
            ) : (
                ""
            )}
        </>
    );
}
