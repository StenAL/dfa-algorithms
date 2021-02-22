import { useState } from "react";
import { AlgorithmMode } from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import DownloadButton from "../input/algorithm/DownloadButton";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGenerator from "./DatasetGenerator";

export default function DatasetGeneration() {
    const [mode, setMode] = useState(AlgorithmMode.EQUIVALENCE_TESTING);
    const [dfa1, setDfa1] = useState<DFA>();
    const [dfa2, setDfa2] = useState<DFA>();
    const [alphabet, setAlphabet] = useState<string[]>(["0", "1"]);
    const inputValid =
        mode === AlgorithmMode.EQUIVALENCE_TESTING
            ? dfa1 !== undefined && dfa2 !== undefined
            : dfa1 !== undefined;
    return (
        <div className={"page-container"}>
            <h2>Dataset Generation</h2>
            <AlgorithmModeSwitch
                mode={mode}
                callback={(m) => {
                    setMode(m);
                    if (m === AlgorithmMode.STATE_MINIMIZATION) {
                        setDfa2(undefined);
                    }
                }}
            />
            <AlphabetInput alphabet={alphabet} callback={setAlphabet} />
            <div className={"dataset-generators-container"}>
                <DatasetGenerator
                    alphabet={alphabet}
                    callback={setDfa1}
                    existingDfa={dfa1}
                    statePrefix={"q"}
                />
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                    <DatasetGenerator
                        alphabet={alphabet}
                        callback={setDfa2}
                        existingDfa={dfa2}
                        statePrefix={"p"}
                    />
                ) : (
                    ""
                )}
            </div>
            <DownloadButton
                disabled={!inputValid}
                text={"Download inputs"}
                dfa1={dfa1!}
                dfa2={dfa2}
            />
        </div>
    );
}
