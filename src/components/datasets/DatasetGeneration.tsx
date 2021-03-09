import { useState } from "react";
import { Link } from "react-router-dom";
import { AlgorithmMode } from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import { serializeDfa } from "../../util/util";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import AlphabetInput from "../input/dfa/AlphabetInput";
import DatasetGenerator from "./DatasetGenerator";

export default function DatasetGeneration() {
    const [mode, setMode] = useState(AlgorithmMode.EQUIVALENCE_TESTING);
    const [alphabet, setAlphabet] = useState<string[]>(["0", "1"]);
    const [dfa1, setDfa1] = useState<DFA>();
    const [dfa2, setDfa2] = useState<DFA>();
    const inputValid =
        (mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa1 && dfa2) ||
        (mode === AlgorithmMode.STATE_MINIMIZATION && dfa1);

    return (
        <div className={"page-container"}>
            <h2>Dataset Generation</h2>
            <AlgorithmModeSwitch mode={mode} callback={setMode} />
            <AlphabetInput alphabet={alphabet} callback={setAlphabet} />
            <div className={"dataset-generators-container"}>
                <DatasetGenerator alphabet={alphabet} statePrefix={"q"} callback={setDfa1} />
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                    <DatasetGenerator alphabet={alphabet} statePrefix={"p"} callback={setDfa2} />
                ) : (
                    ""
                )}
            </div>
            <h3>
                Run algorithms using generated DFA
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? "s" : ""}
            </h3>
            <div className={"generated-data-options"}>
                <Link
                    to={`/algorithm/table-filling/from-dataset?false;${
                        dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""
                    }${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid}>Table-Filling</button>
                </Link>
                <Link
                    to={`/algorithm/table-filling/from-dataset?true;${
                        dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""
                    }${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid || mode === AlgorithmMode.STATE_MINIMIZATION}>
                        Table-Filling (Witness)
                    </button>
                </Link>
                <Link
                    to={`/algorithm/hopcroft/from-dataset?false;${
                        dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""
                    }${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid}>Hopcroft</button>
                </Link>
                <Link
                    to={`/algorithm/hopcroft/from-dataset?true;${
                        dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""
                    }${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid || mode === AlgorithmMode.STATE_MINIMIZATION}>
                        Hopcroft (Witness)
                    </button>
                </Link>
                <Link
                    to={`/algorithm/nearly-linear/from-dataset?false;${
                        dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""
                    }${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid || mode === AlgorithmMode.STATE_MINIMIZATION}>
                        (Nearly) Linear
                    </button>
                </Link>
                <Link
                    to={`/algorithm/nearly-linear/from-dataset?true;${
                        dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""
                    }${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid || mode === AlgorithmMode.STATE_MINIMIZATION}>
                        (Nearly) Linear (Witness)
                    </button>
                </Link>
                <Link
                    to={`/headless/input?${dfa1 ? JSON.stringify(serializeDfa(dfa1)) : ""}${
                        mode === AlgorithmMode.EQUIVALENCE_TESTING && dfa2
                            ? ";" + JSON.stringify(serializeDfa(dfa2!))
                            : ""
                    }`}
                >
                    <button disabled={!inputValid}>Headless mode</button>
                </Link>
            </div>
        </div>
    );
}
