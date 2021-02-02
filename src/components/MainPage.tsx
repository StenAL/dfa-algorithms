import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import AlgorithmVisualization from "./AlgorithmVisualization";
import {dfaA, dfaB} from "../algorithm/data"
import DfaInput from "./input/DfaInput";

export default function MainPage() {
    const tableFillingAlgorithm = new TableFillingAlgorithm(dfaA, dfaB)
    return <div>
        <DfaInput/>
        <AlgorithmVisualization algorithm={tableFillingAlgorithm}/>
    </div>
}