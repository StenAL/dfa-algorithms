import { useState } from "react";
import {
    Algorithm,
    AlgorithmMode,
    AlgorithmType,
    CommonAlgorithmState,
    EquivalenceTestingResult,
} from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import { dfaToNoamInput, getAlgorithmName } from "../../util/util";
import DownloadButton from "../input/algorithm/DownloadButton";
import DfaVisualization from "../visualization/dfa/DfaVisualization";

interface HeadlessModeRunProps {
    algorithms: Algorithm[];
}

type AlgorithmStatuses = {
    [type in AlgorithmType]: AlgorithmStatus;
};

interface AlgorithmStatus {
    start: number;
    end: number;
    result: EquivalenceTestingResult | DFA;
}

const initialStatus: AlgorithmStatus = {
    start: 0,
    end: 0,
    result: EquivalenceTestingResult.NOT_AVAILABLE,
};

export default function HeadlessModeRunner({ algorithms }: HeadlessModeRunProps) {
    const [algorithmStatuses, setAlgorithmStatuses] = useState<AlgorithmStatuses>({
        tableFilling: { ...initialStatus },
        tableFillingWitness: { ...initialStatus },
        hopcroft: { ...initialStatus },
        hopcroftWitness: { ...initialStatus },
        nearlyLinear: { ...initialStatus },
        nearlyLinearWitness: { ...initialStatus },
    });

    const runAlgorithms = () => {
        for (let algorithm of algorithms) {
            algorithm.reset();
            const start = Date.now();
            algorithm.run();
            const end = Date.now();
            const statusesCopy = { ...algorithmStatuses };
            statusesCopy[algorithm.type].start = start;
            statusesCopy[algorithm.type].end = end;
            statusesCopy[algorithm.type].result = algorithm.result;
            setAlgorithmStatuses((_) => statusesCopy);
        }
    };

    return (
        <div className={"headless-runner"}>
            <div className={"headless-table"}>
                <div className={"table-row"} key={`headless-header`}>
                    <div className={"headless-header"}>Algorithm</div>
                    <div className={"headless-cell"}>Duration (ms)</div>
                    <div className={"headless-cell"}>Result</div>
                </div>
                {Array.from(algorithms).map((algorithm) => {
                    const doneRunning = algorithmStatuses[algorithm.type].end !== 0;
                    const duration =
                        algorithmStatuses[algorithm.type].end -
                        algorithmStatuses[algorithm.type].start;
                    let result;
                    if (
                        algorithmStatuses[algorithm.type].result ===
                        EquivalenceTestingResult.NOT_AVAILABLE
                    ) {
                        result = "";
                    } else if (
                        algorithmStatuses[algorithm.type].result ===
                        EquivalenceTestingResult.NON_EQUIVALENT
                    ) {
                        result = "Not Equivalent";
                        if (algorithm.produceWitness) {
                            result += ` (${algorithm.witness})`;
                        }
                    } else if (
                        algorithmStatuses[algorithm.type].result ===
                        EquivalenceTestingResult.EQUIVALENT
                    ) {
                        result = "Equivalent";
                    } else if (
                        algorithm.mode === AlgorithmMode.STATE_MINIMIZATION &&
                        algorithm.result !== algorithm.input1
                    ) {
                        result = (
                            <DownloadButton
                                text={"Download minimized"}
                                dfa={algorithm.result as DFA}
                            />
                        );
                    } else {
                        result = "DFA is minimal";
                    }
                    return (
                        <div className={"table-row"} key={`headless-${algorithm.type}`}>
                            <div className={"headless-header"}>
                                {getAlgorithmName(algorithm.type)}
                            </div>
                            <div className={"headless-cell"}>{doneRunning ? duration : ""}</div>
                            <div className={"headless-cell"}>{result}</div>
                        </div>
                    );
                })}
            </div>
            <button onClick={runAlgorithms}>Start</button>
            {algorithms[0].mode === AlgorithmMode.STATE_MINIMIZATION &&
            algorithms[0].state === CommonAlgorithmState.FINAL &&
            algorithms[0].result !== algorithms[0].input1 ? (
                <>
                    <h3>Minimized result</h3>
                    <DfaVisualization
                        className={"single-visualization"}
                        initialState={(algorithms[0].result as DFA).startingState.name}
                        dfaString={dfaToNoamInput(algorithms[0].result as DFA)}
                    />
                </>
            ) : (
                ""
            )}
        </div>
    );
}
