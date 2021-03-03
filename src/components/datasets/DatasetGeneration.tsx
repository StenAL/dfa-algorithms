import { useState } from "react";
import { AlgorithmMode } from "../../types/Algorithm";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGenerator from "./DatasetGenerator";

export default function DatasetGeneration() {
    const [mode, setMode] = useState(AlgorithmMode.EQUIVALENCE_TESTING);
    const [alphabet, setAlphabet] = useState<string[]>(["0", "1"]);

    return (
        <div className={"page-container"}>
            <h2>Dataset Generation</h2>
            <AlgorithmModeSwitch
                mode={mode}
                callback={(m) => {
                    setMode(m);
                }}
            />
            <AlphabetInput alphabet={alphabet} callback={setAlphabet} />
            <div className={"dataset-generators-container"}>
                <DatasetGenerator alphabet={alphabet} statePrefix={"q"} />
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                    <DatasetGenerator alphabet={alphabet} statePrefix={"p"} />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
