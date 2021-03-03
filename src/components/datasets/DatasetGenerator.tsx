import { useState } from "react";
import {
    linearDatasetGenerator,
    randomDatasetGenerator,
    sprawlingDatasetGenerator,
} from "../../algorithm/data/datasetGenerator";
import { DatasetType } from "../../types/Dataset";
import { DFA } from "../../types/DFA";
import { getPrettyDfaString } from "../../util/util";
import DownloadButton from "../input/algorithm/DownloadButton";
import DatasetModeSelect from "./DatasetModeSelect";

interface GeneratorProps {
    statePrefix: string;
    alphabet: string[];
}

export default function DatasetGenerator({ alphabet, statePrefix }: GeneratorProps) {
    const [generationMode, setGenerationMode] = useState(DatasetType.RANDOM);
    const [statesCount, setStatesCount] = useState(7);
    const [finalStatesCount, setFinalStatesCount] = useState(1);
    const [dfa, setDfa] = useState<DFA>();

    const alphabetValid = alphabet.length > 0 && new Set(alphabet).size === alphabet.length;
    const statesCountValid = !isNaN(statesCount) && statesCount > 0;
    const finalStatesCountValid = !isNaN(finalStatesCount) && statesCount >= finalStatesCount;

    const inputValid = alphabetValid && statesCountValid && finalStatesCountValid;
    return (
        <div className={"dataset-generator"}>
            <h3>Choose dataset type</h3>
            <DatasetModeSelect
                statePrefix={statePrefix}
                generationMode={generationMode}
                callback={setGenerationMode}
            />
            <h3>Parameters</h3>
            <div className={"dataset-parameters"}>
                <label htmlFor={"statesCount"}>Number of states</label>
                <input
                    type={"text"}
                    name={"statesCount"}
                    defaultValue={"7"}
                    className={statesCountValid ? "" : "invalid-input"}
                    onChange={(e) => setStatesCount(parseInt(e.target.value))}
                />
                <label htmlFor={"finalStatesCount"}>Number of final states</label>
                <input
                    type={"text"}
                    name={"finalStatesCount"}
                    defaultValue={"1"}
                    className={finalStatesCountValid ? "" : "invalid-input"}
                    onChange={(e) => setFinalStatesCount(parseInt(e.target.value))}
                />
            </div>
            <button
                disabled={!inputValid}
                onClick={() => {
                    let generator;
                    switch (generationMode) {
                        case DatasetType.RANDOM:
                            generator = randomDatasetGenerator;
                            break;
                        case DatasetType.SPRAWLING:
                            generator = sprawlingDatasetGenerator;
                            break;
                        case DatasetType.LINEAR:
                            generator = linearDatasetGenerator;
                            break;
                    }
                    const dfa = generator(statesCount, alphabet, finalStatesCount, statePrefix);
                    setDfa(dfa);
                }}
            >
                Generate
            </button>
            {dfa ? (
                <>
                    <div className={"log"}>
                        {getPrettyDfaString(dfa)
                            .reverse()
                            .map((s) => (
                                <p key={s}>{s}</p>
                            ))}
                    </div>
                    <DownloadButton text={"Download"} dfa={dfa} />
                </>
            ) : (
                ""
            )}
        </div>
    );
}
