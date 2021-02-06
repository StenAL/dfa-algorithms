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

export default function InputContainer({
    modes,
    runCallback,
    runLink,
}: InputContainerProps) {
    const [input1, setInput1] = useState<DFA>();
    const [input2, setInput2] = useState<DFA>();
    const [alphabet, setAlphabet] = useState<string[]>([]);
    const [mode, setMode] = useState<AlgorithmMode>(
        modes.length === 1 ? modes[0] : AlgorithmMode.EQUIVALENCE_TESTING
    );
    const alphabetValid =
        alphabet.length > 0 && new Set(alphabet).size === alphabet.length;
    let inputValid = false;
    if (mode === AlgorithmMode.EQUIVALENCE_TESTING && input1 && input2) {
        inputValid = true;
    } else if (mode === AlgorithmMode.STATE_MINIMIZATION && input1) {
        inputValid = true;
    }
    return (
        <div className={"input-container"}>
            <div className={"input-fields-container"}>
                <h3>Input custom DFA(s)</h3>
                {modes.length > 1 ? (
                    <AlgorithmModeSwitch
                        mode={mode}
                        callback={(mode) => setMode(mode)}
                    />
                ) : (
                    ""
                )}
                <div className={"alphabet-input"}>
                    <label htmlFor={"alphabet"}>Alphabet</label>
                    <input
                        name={"alphabet"}
                        type={"text"}
                        placeholder={"0,1,..."}
                        onChange={(event) => {
                            const newAlphabet = event.target.value.split(",");
                            if (
                                newAlphabet.length > 0 &&
                                newAlphabet[newAlphabet.length - 1] === ""
                            ) {
                                newAlphabet.pop();
                            }
                            setAlphabet(newAlphabet);
                        }}
                        className={alphabetValid ? "" : "invalid-input"}
                    />
                </div>
                <div className={"dfa-inputs-container"}>
                    <DfaInput
                        convertInputCallback={(dfa) => setInput1(dfa)}
                        alphabet={alphabet}
                        alphabetValid={alphabetValid}
                    />
                    {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                        <DfaInput
                            alphabet={alphabet}
                            alphabetValid={alphabetValid}
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
                    <button
                        disabled={!inputValid}
                        onClick={() => runCallback(input1!, input2)}
                    >
                        Run
                    </button>
                </Link>
            </div>
            <div className={"pre-generated-inputs-container"}>
                <h3>...or use a pre-generated input:</h3>
                <Link to={runLink}>
                    <button
                        onClick={() =>
                            runCallback(
                                dfaA,
                                mode === AlgorithmMode.EQUIVALENCE_TESTING
                                    ? dfaB
                                    : undefined
                            )
                        }
                    >
                        Example inputs
                    </button>
                </Link>
            </div>
        </div>
    );
}
