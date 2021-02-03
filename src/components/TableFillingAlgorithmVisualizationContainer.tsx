import {useState} from "react";
import {Link, Route} from "react-router-dom";
import {dfaA, dfaB} from "../algorithm/data";
import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import {DFA} from "../types/DFA";
import AlgorithmVisualization from "./AlgorithmVisualization";
import DfaInput from "./input/DfaInput";

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
                <p>Input:</p>
                <div className={"inputs-container"}>
                    <DfaInput convertInputCallback={(dfa) => setInput1(dfa)}/>
                    {mode === Mode.EQUIVALENCE_TESTING ?
                        <DfaInput convertInputCallback={(dfa) => setInput2(dfa)}/> : ""}
                </div>
                {inputValid ? <Link to={"/table-filling/algorithm"}>Run</Link> : ""}
                <p>or use a pre-generated input: **todo: add more**</p>
                <Link to={"/table-filling/algorithm"}><button onClick={() => {
                    setInput1(dfaA);
                    setInput2(dfaB);
                }}>Example inputs</button></Link>
            </Route>
            <Route path={"/table-filling/algorithm"}>
                <AlgorithmVisualization algorithm={new TableFillingAlgorithm(input1!, input2!)}/>
            </Route>
        </>)
}