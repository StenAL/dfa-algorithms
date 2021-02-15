import { useState } from "react";
import { Link } from "react-router-dom";
import { default as Tooltip } from "react-tooltip";
import { AlgorithmMode } from "../../../types/Algorithm";
import { DFA } from "../../../types/DFA";
import StatesInput from "../dfa/StatesInput";
import PreGeneratedInputs from "./PreGeneratedInputs";

interface AlgorithmInputProps {
    mode: AlgorithmMode;
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
    runLink: string;
}

export default function AlgorithmInput({ mode, runCallback, runLink }: AlgorithmInputProps) {
    const [input1, setInput1] = useState<DFA>();
    const [input2, setInput2] = useState<DFA>();
    const [alphabet, setAlphabet] = useState<string[]>([]);

    const alphabetValid = alphabet.length > 0 && new Set(alphabet).size === alphabet.length;
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
                <div className={"alphabet-input"}>
                    <label htmlFor={"alphabet"}>
                        Alphabet
                        <span className={"info-tooltip"} data-tip data-for="alphabet-help">
                            ?
                        </span>
                    </label>
                    <Tooltip
                        place={"top"}
                        type={"info"}
                        id="alphabet-help"
                        effect={"solid"}
                        multiline={true}
                    >
                        <span>
                            The alphabet the DFA(s) will use in the form of a comma-separated list
                            <br /> e.g. '0,1,2' or 'a,b'. Can not contain duplicate symbols
                        </span>
                    </Tooltip>
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
                    <StatesInput
                        convertInputCallback={(dfa) => setInput1(dfa)}
                        alphabet={alphabet}
                        alphabetValid={alphabetValid}
                    />
                    {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                        <StatesInput
                            alphabet={alphabet}
                            alphabetValid={alphabetValid}
                            convertInputCallback={(dfa) => setInput2!(dfa)}
                        />
                    ) : (
                        ""
                    )}
                </div>
                <Link className={inputValid ? "" : "disabled-link"} to={runLink}>
                    <button disabled={!inputValid} onClick={() => runCallback(input1!, input2)}>
                        Run
                    </button>
                </Link>
            </div>
            <h3>...or use a pre-generated input:</h3>
            <PreGeneratedInputs mode={mode} runLink={runLink} runCallback={runCallback} />
        </div>
    );
}
