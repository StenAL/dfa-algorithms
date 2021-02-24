import _ from "lodash";
import { default as Tooltip } from "react-tooltip";
import { HopcroftAlgorithm, HopcroftAlgorithmState } from "../../algorithm/HopcroftAlgorithm";
import {
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
} from "../../types/Algorithm";

interface HopcroftAlgorithmVisualizationProps {
    algorithm: HopcroftAlgorithm;
}

export default function HopcroftAlgorithmVisualization({
    algorithm,
}: HopcroftAlgorithmVisualizationProps) {
    const renderInverseTransitionFunction =
        algorithm.state === HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED;
    const inverseTransitionFunction = renderInverseTransitionFunction ? (
        <div className={"visualization-table"}>
            <div className={"table-row"} key={`inverse-transition-header`}>
                <div className={"visualization-header"}>State</div>
                <div className={"visualization-header"}>Symbol</div>
                <div className={"visualization-cell"}>Predecessors</div>
            </div>
            {Array.from(algorithm.inverseTransitionFunction.entries())
                .sort(([[state1]], [[state2]]) => state1.name.localeCompare(state2.name))
                .map(([[state, symbol], states]) => {
                    return (
                        <div
                            className={"table-row"}
                            key={`inverse-transition-${state.name}-${symbol}`}
                        >
                            <div className={"visualization-header"}>{state.name}</div>
                            <div className={"visualization-header"}>{symbol}</div>
                            <div className={"visualization-cell"}>
                                {`{${Array.from(states)
                                    .map((s) => s.name)
                                    .join(", ")}}`}
                            </div>
                        </div>
                    );
                })}
        </div>
    ) : (
        ""
    );

    const renderPartitions = !(
        HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED === algorithm.state ||
        HopcroftAlgorithmState.CONSTRUCTING_WITNESS === algorithm.state
    );
    const partitions = renderPartitions ? (
        <div className={"visualization-table"}>
            <div className={"table-row"} key={`partitions-header`}>
                <div className={"visualization-header"}>Block</div>
                <div className={"visualization-cell"}>States</div>
            </div>
            {Array.from(algorithm.blocks.entries()).map(([number, states]) => {
                return (
                    <div className={"table-row"} key={`partition-${number}`}>
                        <div className={"visualization-header"}>{number}</div>
                        <div className={"visualization-cell"}>
                            {`{${Array.from(states)
                                .map((s) => s.name)
                                .join(", ")}}`}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        ""
    );

    const renderStatesWithPredecessors =
        HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED === algorithm.state ||
        HopcroftAlgorithmState.PARTITIONING_BLOCKS === algorithm.state;
    const statesWithPredecessors = renderStatesWithPredecessors ? (
        <div className={"visualization-table"}>
            <div className={"table-row"} key={`predecessor-set-header`}>
                <div className={"visualization-header"}>Block</div>
                <div className={"visualization-header"}>Symbol</div>
                <div className={"visualization-cell"}>States</div>
            </div>
            {Array.from(algorithm.statesWithPredecessors.entries())
                .filter(([_, states]) => states.size > 0)
                .map(([[symbol, blockNumber], states]) => {
                    return (
                        <div
                            className={"table-row"}
                            key={`predecessor-set-${symbol}-${blockNumber}`}
                        >
                            <div className={"visualization-header"}>{blockNumber}</div>
                            <div className={"visualization-header"}>{symbol}</div>
                            <div className={"visualization-cell"}>
                                {`{${Array.from(states)
                                    .map((s) => s.name)
                                    .join(", ")}}`}
                            </div>
                        </div>
                    );
                })}
        </div>
    ) : (
        ""
    );

    const renderToDoLists =
        HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED === algorithm.state ||
        HopcroftAlgorithmState.PARTITIONING_BLOCKS === algorithm.state;
    const toDoLists = renderToDoLists ? (
        <div className={"visualization-table"}>
            <div className={"table-row"} key={`to-do-list-header`}>
                <div className={"visualization-header"}>Symbol</div>
                <div className={"visualization-cell"}>Blocks</div>
            </div>
            {Array.from(algorithm.toDoLists.entries()).map(([symbol, blockNumbers]) => {
                return (
                    <div className={"table-row"} key={`to-do-list-${symbol}`}>
                        <div className={"visualization-header"}>{symbol}</div>
                        <div className={"visualization-cell"}>
                            {`{${Array.from(blockNumbers).join(", ")}}`}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        ""
    );

    const renderWitnessTable =
        algorithm.state === HopcroftAlgorithmState.CONSTRUCTING_WITNESS ||
        (algorithm.produceWitness &&
            algorithm.state === CommonAlgorithmState.FINAL &&
            algorithm.mode === AlgorithmMode.EQUIVALENCE_TESTING);
    const witnessTable = renderWitnessTable ? (
        <div className={"visualization-table"}>
            <div className={"table-row"} key={`witness-table-header-row`}>
                <div className={"table-header table-cell"} />
                {algorithm.input1.states.map((s) => (
                    <div className={"table-header table-cell"} key={`witness-header-${s.name}`}>
                        {s.name}
                    </div>
                ))}
            </div>
            {_.chunk(
                algorithm.witnessTable.entries().map(([[s1, s2], symbol]) => {
                    return (
                        <div className={"table-cell"} key={`witness-${s1.name}-${s2.name}`}>
                            {symbol}
                        </div>
                    );
                }),
                algorithm.input1.states.length
            ).map((row, i) => (
                <div className={"table-row"} key={`witness-row-${i}`}>
                    <div className={"table-header table-cell"} key={`witness-header-${i}`}>
                        {algorithm.input2.states[i].name}
                    </div>
                    {row}
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
        case HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED:
            if (algorithm.mode === AlgorithmMode.STATE_MINIMIZATION) {
                stateDescription = "Witness Table created.";
            }
            stateDescription += "Inverse transition function created";
            break;
        case HopcroftAlgorithmState.INITIAL_PARTITIONS_CREATED:
            stateDescription = "Initial partitions created";
            break;
        case HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED:
            stateDescription = "Initial sets of states with predecessors created";
            break;
        case HopcroftAlgorithmState.PARTITIONING_BLOCKS:
            stateDescription = "Partitioning blocks";
            break;
        case HopcroftAlgorithmState.ALL_BLOCKS_PARTITIONED:
            stateDescription = "All blocks partitioned";
            break;
        case HopcroftAlgorithmState.CONSTRUCTING_WITNESS:
            stateDescription = "Constructing witness";
            break;
        case CommonAlgorithmState.FINAL:
            stateDescription = "Final state";
            let resultString = "";
            if (algorithm.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
                resultString =
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
            } else {
                if (Array.from(algorithm.blocks.values()).every((states) => states.size === 1)) {
                    resultString = `All states are distinguishable, the DFA is already minimal.`;
                } else {
                    resultString = `States ${Array.from(algorithm.blocks.values())
                        .filter((states) => states.size > 1)
                        .filter((states) => states.size > 0)
                        .map((states) => `{${Array.from(states).map((s) => s.name)}}`)
                        .join(", ")} can be combined.`;
                }
                // todo output link to or JSON of minimized DFA somewhere here
                // const result: DFA = algorithm.result as DFA;
            }
            stateDescription += ". " + resultString;
            break;
    }

    return (
        <>
            <p>Current state: {stateDescription}</p>
            {renderInverseTransitionFunction ? (
                <>
                    <h3>Inverse transition function</h3>
                    {inverseTransitionFunction}
                </>
            ) : (
                ""
            )}
            {renderWitnessTable ? (
                <>
                    <h3>Witness table</h3>
                    {witnessTable}
                </>
            ) : (
                ""
            )}
            {renderPartitions && algorithm.blocks.size > 0 ? (
                <>
                    <h3>Partitions</h3>
                    {partitions}
                </>
            ) : (
                ""
            )}
            {renderStatesWithPredecessors && algorithm.statesWithPredecessors.count() > 0 ? (
                <>
                    <h3>
                        States with predecessors by block and symbol
                        <span
                            className={"info-tooltip header-tooltip"}
                            data-tip
                            data-for="predecessors-help"
                        >
                            ?
                        </span>
                    </h3>
                    <Tooltip
                        place={"top"}
                        type={"info"}
                        id="predecessors-help"
                        effect={"solid"}
                        multiline={true}
                    >
                        <span>
                            Each row in this table indicates the states in block number *block* that
                            have any predecessors on input *symbol*.
                            <br /> The predecessors of a state are states that that have direct
                            transitions to it.
                        </span>
                    </Tooltip>
                    {statesWithPredecessors}
                </>
            ) : (
                ""
            )}
            {renderToDoLists && algorithm.toDoLists.size > 0 ? (
                <>
                    <h3>To-do lists</h3>
                    {toDoLists}
                </>
            ) : (
                ""
            )}
        </>
    );
}
