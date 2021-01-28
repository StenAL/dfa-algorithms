import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import AlgorithmVisualization from "./AlgorithmVisualization";
import {dfaA, dfaB} from "../algorithm/data"

export default function MainPage() {
    const tableFillingAlgorithm = new TableFillingAlgorithm(dfaA, dfaB)
    return <div>
        <AlgorithmVisualization algorithm={tableFillingAlgorithm}/>
    </div>
}