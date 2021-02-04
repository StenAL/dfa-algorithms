import { useState } from "react";
import { Link } from "react-router-dom";
import { dfaA, dfaB } from "../../algorithm/data";
import { AlgorithmMode } from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import AlgorithmModeSwitch from "./AlgorithmModeSwitch";
import DfaInput from "./DfaInput";

interface InputContainerProps {
    modes: AlgorithmMode[];
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
    runLink: string;
}

export default function InputContainer({modes, runCallback, runLink}: InputContainerProps) {
    const [input1, setInput1] = useState<DFA>();
    const [input2, setInput2] = useState<DFA>();
    const [mode, setMode] = useState<AlgorithmMode>(modes.length === 1 ? modes[0] : AlgorithmMode.EQUIVALENCE_TESTING);
    let inputValid = false;
    if (mode === AlgorithmMode.EQUIVALENCE_TESTING && input1 && input2) {
        inputValid = true;
    } else if (mode === AlgorithmMode.STATE_MINIMIZATION && input1) {
        inputValid = true;
    }
    // todo: check that input1 and input2 state names have no overlap
    return (<>
        {modes.length > 1 ?
            <AlgorithmModeSwitch mode={mode} callback={(mode) => setMode(mode)} /> : ""
        }
        <div className={"inputs-container"}>
            <DfaInput convertInputCallback={(dfa) => setInput1(dfa)} />
            {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                <DfaInput
                    convertInputCallback={(dfa) => setInput2!(dfa)}
                />
            ) : (
                ""
            )}
        </div>
        <Link
            className={inputValid ? "" : "disabled-link"}
            to={runLink}
        >
            <button disabled={!inputValid} onClick={() => runCallback(input1!, input2)}>Run</button>
        </Link>
        <p>or use a pre-generated input:</p>
        <Link to={runLink}>
            <button
                onClick={() => runCallback(dfaA, mode === AlgorithmMode.EQUIVALENCE_TESTING ? dfaB : undefined)}
            >
                Example inputs
            </button>
        </Link>
    </>);
}