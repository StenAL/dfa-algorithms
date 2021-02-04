import TableFillingAlgorithm, { TableFillingAlgorithmState } from "../algorithm/TableFillingAlgorithm";
import { CommonAlgorithmState, EquivalenceTestingResult } from "../types/Algorithm";

interface AlgorithmVisualizationProps {
    algorithm: TableFillingAlgorithm;
}

export default function TableFillingAlgorithmVisualization({
    algorithm,
}: AlgorithmVisualizationProps) {
    const rows: string[][] = [];
    let prevTitle = "";
    let row: string[] = [];
    let fillingColumnTitles = true;
    for (let pair of algorithm.pairs.entries()) {
        const title1 = pair[0][0].name;
        const title2 = pair[0][1].name;
        if (title1 !== prevTitle) {
            // new row in table
            if (prevTitle !== "") {
                fillingColumnTitles = false;
            }
            prevTitle = title1;
            rows.push(row);
            row = [];
            row.push(title1);
        }

        if (fillingColumnTitles) {
            rows[0].push(title2);
        }
        row.push(`[${pair[1]}]`);
    }
    rows.push(row); // push final row
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
            const resultString = "Result: DFAs are " + (algorithm.result === EquivalenceTestingResult.EQUIVALENT ? " equivalent" : "non-equivalent")
            stateDescription += ". " + resultString;
            break;

    }
    return (
        <div className={"table-filling-visualization"}>
            <p>Current state: {stateDescription}</p>
            {pairs.length > 1 ? (
                <div className={"table-filling-table"}>{pairs}</div>
            ) : (
                ""
            )}
        </div>
    );
}
