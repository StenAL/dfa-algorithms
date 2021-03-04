import { useState } from "react";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGenerator from "./DatasetGenerator";

export default function DatasetGeneration() {
    const [alphabet, setAlphabet] = useState<string[]>(["0", "1"]);
    // todo: let user set stateprefix
    return (
        <div className={"page-container"}>
            <h2>Dataset Generation</h2>
            <AlphabetInput alphabet={alphabet} callback={setAlphabet} />
            <DatasetGenerator alphabet={alphabet} statePrefix={"q"} />
        </div>
    );
}
