import { useState } from "react";
import { preGeneratedDatasets } from "../../../algorithm/data/datasets";
import { AlgorithmMode } from "../../../types/Algorithm";
import { PreGeneratedDataset, PreGeneratedDatasetName } from "../../../types/Dataset";
import { DFA } from "../../../types/DFA";
import { deserializeDfa, getPreGeneratedDatasetPrintName } from "../../../util/util";

interface PreGeneratedInputsProps {
    mode: AlgorithmMode;
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
}

export default function PreGeneratedInputs({ mode, runCallback }: PreGeneratedInputsProps) {
    const [fileError, setFileError] = useState("");

    const links = (Object.entries(preGeneratedDatasets) as [
        PreGeneratedDatasetName,
        PreGeneratedDataset
    ][]).map(([name, dataset]) => (
        <button
            onClick={() =>
                runCallback(
                    dataset[0],
                    mode === AlgorithmMode.EQUIVALENCE_TESTING ? dataset[1] : undefined
                )
            }
        >
            {getPreGeneratedDatasetPrintName(name)}
        </button>
    ));

    return (
        <div className={"pre-generated-inputs"}>
            {links}
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
                    } catch (e) {
                        setFileError(e.message);
                    }
                }}
            />
            <div>
                <button className={"file-input-button"}>
                    <label htmlFor="files" className={"file-input-label"}>
                        Select file...
                    </label>
                </button>
            </div>
            {fileError === "" ? (
                ""
            ) : (
                <span className={"invalid-indicator"}>Invalid input: {fileError}</span>
            )}
        </div>
    );
}
