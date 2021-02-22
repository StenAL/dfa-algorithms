import { useState } from "react";
import { Link } from "react-router-dom";
import { AlgorithmMode } from "../../../types/Algorithm";
import { DFA } from "../../../types/DFA";
import AlphabetInput from "../dfa/AlphabetInput";
import StatesInput from "../dfa/StatesInput";
import DownloadButton from "./DownloadButton";
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
        <div className={"page-container"}>
            <h3>Use a pre-generated input:</h3>
            <PreGeneratedInputs mode={mode} runLink={runLink} runCallback={runCallback} />
            <h3>
                ... or input {mode === AlgorithmMode.STATE_MINIMIZATION ? "a" : ""} custom DFA
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? "s" : ""}
            </h3>
            <AlphabetInput alphabet={alphabet} callback={setAlphabet} />
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
                        convertInputCallback={(dfa) => setInput2(dfa)}
                    />
                ) : (
                    ""
                )}
            </div>
            <DownloadButton
                disabled={!inputValid}
                text={"Save to File"}
                dfa1={input1!}
                dfa2={input2}
            />
            <Link className={inputValid ? "" : "disabled-link"} to={runLink}>
                <button disabled={!inputValid} onClick={() => runCallback(input1!, input2)}>
                    Run
                </button>
            </Link>
        </div>
    );
}
