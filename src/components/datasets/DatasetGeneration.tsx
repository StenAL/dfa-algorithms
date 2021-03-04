import { useState } from "react";
import { default as Tooltip } from "react-tooltip";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGenerator from "./DatasetGenerator";

export default function DatasetGeneration() {
    const [alphabet, setAlphabet] = useState<string[]>(["0", "1"]);
    const [statePrefix, setStatePrefix] = useState<string>("q");
    return (
        <div className={"page-container"}>
            <h2>Dataset Generation</h2>
            <AlphabetInput alphabet={alphabet} callback={setAlphabet} />
            <label htmlFor={"statePrefix"}>
                State prefix
                <span className={"info-tooltip"} data-tip data-for="state-prefix-help">
                    ?
                </span>
            </label>
            <Tooltip
                place={"top"}
                type={"info"}
                id="state-prefix-help"
                effect={"solid"}
                multiline={true}
            >
                <span>
                    The state prefix is prepended to name of every state in the generated DFA.
                    <br />
                    For example, if the prefix is "q", then the states in the DFA will be "q0",
                    "q1", etc.
                    <br />
                    This is useful to customize if you wish to generate and compare different DFAs
                    and want to differentiate their states with different prefixes.
                </span>
            </Tooltip>
            <input
                className={"state-prefix"}
                name={"statePrefix"}
                type={"text"}
                value={statePrefix}
                onChange={(event) => {
                    setStatePrefix(event.target.value);
                }}
            />
            <DatasetGenerator alphabet={alphabet} statePrefix={statePrefix} />
        </div>
    );
}
