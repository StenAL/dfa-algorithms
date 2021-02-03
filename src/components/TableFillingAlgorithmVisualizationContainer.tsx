import {useState} from "react";
import {Link, Route} from "react-router-dom";
import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import {DFA} from "../types/DFA";
import AlgorithmVisualization from "./AlgorithmVisualization";
import DfaInput from "./input/DfaInput";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";

enum Mode {
    EQUIVALENCE_TESTING,
    MINIMIZATION
}

export default function TableFillingAlgorithmVisualizationContainer() {
    const [input1, setInput1] = useState<DFA>();
    const [input2, setInput2] = useState<DFA>();
    const [mode, setMode] = useState<Mode>(Mode.EQUIVALENCE_TESTING);
    let inputValid = false;
    if (mode === Mode.EQUIVALENCE_TESTING) {
        if (input1 && input2) {
            inputValid = true;
        }
    }
    return (
        <>
            <Route path={"/table-filling/input"}>
                <DfaInput convertInputCallback={(dfa) => setInput1(dfa)}/>
                {mode === Mode.EQUIVALENCE_TESTING ? <DfaInput convertInputCallback={(dfa) => setInput2(dfa)}/> : ""}
                {inputValid ? <Link to={"/table-filling/algorithm"}>Run</Link> : ""}
            </Route>
            <Route path={"/table-filling/algorithm"}>
                <AlgorithmVisualization algorithm={new TableFillingAlgorithm(input1!, input2!)}/>
            </Route>
        </>)
}