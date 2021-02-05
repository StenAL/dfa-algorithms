import TableFillingAlgorithm, { TableFillingAlgorithmState } from "../algorithm/TableFillingAlgorithm";
import { AlgorithmMode, CommonAlgorithmState, EquivalenceTestingResult } from "../types/Algorithm";

interface AlgorithmVisualizationProps {
    algorithm: TableFillingAlgorithm;
}

export default function TableFillingAlgorithmVisualization({
    algorithm,
}: AlgorithmVisualizationProps) {
    const rows: string[][] = [];
    let prevTitle = "";
    let row: string[] = [];
    let allStates;
    if (algorithm.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
        allStates = algorithm.input1.states.concat(algorithm.input2.states);
    } else {
        allStates = algorithm.input1.states;
    }
    for (let pair of algorithm.pairs.entries()) {
        const title1 = pair[0][0].name;
        if (title1 !== prevTitle) { // new row in table
            if (prevTitle !== "") {
                rows.push(row);
            }
            prevTitle = title1;
            row = [];
        }
        row.unshift(`[${pair[1]}]`);
    }
    rows.push(row); // push final row
    if (rows.length > 1 || (rows.length === 1 && rows[0].length > 0) ) {
        const titleRow = [];
        for (let i = 1; i < allStates.length; i++) {
            const state = allStates[i];
            titleRow.unshift(state.name)
        }
        rows.unshift(titleRow)
        for (let i = 1; i < allStates.length; i++) {
            const state = allStates[i-1];
            rows[i].unshift(state.name)
        }
    }
    rows[0].unshift("");

    const pairs = rows.map((row, j) => (
        <div className={"table-filling-row"} key={`${j}`}>
            {row.map((el, i) => {
                const header = i === 0 || j === 0;
                return (
                    <div
                        className={
                            "table-filling-cell" +
                            (header ? " table-filling-header" : "")
                        }
                        key={`${i}-${j}`}
                    >
                        {el}
                    </div>
                );
            })}
        </div>
    ));
    let stateDescription = ""
    switch (algorithm.state) {
        case CommonAlgorithmState.INITIAL:
            stateDescription = "Initial state"
            break;
        case TableFillingAlgorithmState.EMPTY_TABLE:
            stateDescription = "Table created"
            break;
        case TableFillingAlgorithmState.MARKING_PAIRS:
            stateDescription = "Marking pairs"
            break;
        case TableFillingAlgorithmState.ALL_PAIRS_MARKED:
            stateDescription = "All pairs marked"
            break;
        case CommonAlgorithmState.FINAL:
            stateDescription = "Final state"
            let resultString;
            if (algorithm.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
                resultString = "Result: DFAs are " + (algorithm.result === EquivalenceTestingResult.EQUIVALENT ? " equivalent" : "non-equivalent")
            } else {
                resultString = "States **todo** can be combined."
            }
            stateDescription += ". " + resultString;
            break;

    }
    return (
        <>
            <p className={"table-filling-state"}>Current state: {stateDescription}</p>
            {pairs.length > 1 ? (
                <div className={"table-filling-table"}>{pairs}</div>
            ) : (
                ""
            )}
        </>
    );
}
