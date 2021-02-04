import { useState } from "react";
import { Link, Route } from "react-router-dom";
import { default as Switch } from "react-switch";
import { dfaA, dfaB } from "../algorithm/data";
import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import { DFA } from "../types/DFA";
import AlgorithmVisualization from "./AlgorithmVisualization";
import DfaInput from "./input/DfaInput";

enum Mode {
    EQUIVALENCE_TESTING,
    MINIMIZATION,
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
                <p>Choose mode:</p>
                <span>Equivalence testing</span>
                <Switch
                    checked={mode === Mode.MINIMIZATION}
                    onChange={() => {
                        mode === Mode.EQUIVALENCE_TESTING
                            ? setMode(Mode.MINIMIZATION)
                            : setMode(Mode.EQUIVALENCE_TESTING);
                    }}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    offHandleColor={"#95E2FF"}
                    onHandleColor={"#95E2FF"}
                    offColor={"#888"}
                    onColor={"#888"}
                    width={75}
                />
                <span>State minimization</span>
                <p>Input:</p>
                <div className={"inputs-container"}>
                    <DfaInput convertInputCallback={(dfa) => setInput1(dfa)} />
                    {mode === Mode.EQUIVALENCE_TESTING ? (
                        <DfaInput
                            convertInputCallback={(dfa) => setInput2(dfa)}
                        />
                    ) : (
                        ""
                    )}
                </div>
                <Link
                    className={"disabled-link"}
                    to={"/table-filling/algorithm"}
                >
                    <button disabled={!inputValid}>Run</button>
                </Link>
                <p>or use a pre-generated input: **todo: add more**</p>
                <Link to={"/table-filling/algorithm"}>
                    <button
                        onClick={() => {
                            setInput1(dfaA);
                            setInput2(dfaB);
                        }}
                    >
                        Example inputs
                    </button>
                </Link>
            </Route>
            <Route path={"/table-filling/algorithm"}>
                <AlgorithmVisualization
                    algorithm={new TableFillingAlgorithm(input1!, input2!)}
                />
            </Route>
        </>
    );
}
