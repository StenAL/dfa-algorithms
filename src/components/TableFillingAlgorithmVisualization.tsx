import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";

interface AlgorithmVisualizationProps {
    algorithm: TableFillingAlgorithm;
}

export default function TableFillingAlgorithmVisualization({algorithm}: AlgorithmVisualizationProps) {
    const rows: string[][] = []
    let prevTitle = ""
    let row: string[] = []
    let fillingColumnTitles = true;
    for (let pair of algorithm.pairs.entries()) {
        const title1 = pair[0][0].name;
        const title2 = pair[0][1].name;
        if (title1 !== prevTitle) { // new row in table
            if (prevTitle !== "") {
                fillingColumnTitles = false
            }
            prevTitle = title1
            rows.push(row)
            row = []
            row.push(title1)
        }

        if (fillingColumnTitles) {
            rows[0].push(title2)
        }
        row.push(`[${pair[1]}]`)
    }
    rows.push(row) // push final row
    rows[0].unshift("")

    const pairs = rows.map((row, j) =>
        <div className={"table-filling-row"} key={`${j}`}>
        {row.map((el, i) => <div className={"table-filling-cell"} key={`${i}-${j}`}>{el}</div>)}
    </div>)
    return <div>
        <h3>Pairs</h3>
        {pairs}
    </div>
}