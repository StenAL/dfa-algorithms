import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { dfaA, dfaB } from "../../../algorithm/data/exampleData";
import { AlgorithmMode } from "../../../types/Algorithm";
import { DFA } from "../../../types/DFA";
import { deserializeDfa } from "../../../util/util";

interface PreGeneratedInputsProps {
    mode: AlgorithmMode;
    runLink: string;
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
}

export default function PreGeneratedInputs({
    mode,
    runCallback,
    runLink,
}: PreGeneratedInputsProps) {
    const history = useHistory();
    const [fileError, setFileError] = useState("");
    return (
        <div className={"pre-generated-inputs"}>
            <Link to={runLink}>
                <button
                    onClick={() =>
                        runCallback(
                            dfaA,
                            mode === AlgorithmMode.EQUIVALENCE_TESTING ? dfaB : undefined
                        )
                    }
                >
                    Example inputs
                </button>
            </Link>
            <Link to={runLink} className={"disabled-link"}>
                <button disabled={true}>More to come</button>
            </Link>
            <input
                type="file"
                id={"files"}
                className={"file-input"}
                multiple={true}
                onChange={async (event) => {
                    try {
                        const file = event.target.files!.item(0)!;
                        const text = await file.text();
                        const json = JSON.parse(text);
                        const input1 = JSON.parse(json.input1);
                        const input2 = JSON.parse(json.input2);
                        if (mode === AlgorithmMode.EQUIVALENCE_TESTING && input2 === 0) {
                            setFileError(
                                "Need 2 DFAs for equivalence testing but input only has one"
                            );
                            return;
                        }

                        const dfa1 = deserializeDfa(input1);
                        const dfa2 = input2 === 0 ? undefined : deserializeDfa(input2);
                        setFileError("");
                        runCallback(
                            dfa1,
                            mode === AlgorithmMode.EQUIVALENCE_TESTING ? dfa2 : undefined
                        );
                        history.push(runLink);
                    } catch (e) {
                        setFileError(e.message);
                    }
                }}
            />
            <label htmlFor="files" className={"file-input-label"}>
                <button>Select file</button>
            </label>
            {fileError === "" ? (
                ""
            ) : (
                <span className={"invalid-indicator"}>Invalid input: {fileError}</span>
            )}
        </div>
    );
}
