import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import TableFillingAlgorithm from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, AlgorithmMode, AlgorithmsSelected } from "../../types/Algorithm";
import AlgorithmInput from "../input/AlgorithmInput";
import AlgorithmModeSwitch from "../input/AlgorithmModeSwitch";
import AlgorithmPicker from "../input/AlgorithmPicker";
import HeadlessModeRun from "./HeadlessModeRun";

export default function HeadlessMode() {
    const [mode, setMode] = useState(AlgorithmMode.EQUIVALENCE_TESTING);
    const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
    const [algorithmsSelected, setAlgorithmsSelected] = useState<AlgorithmsSelected>({
        nearlyLinear: false,
        hopcroft: false,
        hopcroftWitness: false,
        nearlyLinearWitness: false,
        tableFilling: false,
        tableFillingWitness: false,
    });

    useEffect(() => {
        if (mode === AlgorithmMode.STATE_MINIMIZATION) {
            const algorithmsSelectedCopy = { ...algorithmsSelected };
            algorithmsSelectedCopy.tableFillingWitness = false;
            algorithmsSelectedCopy.hopcroftWitness = false;
            algorithmsSelectedCopy.nearlyLinear = false;
            algorithmsSelectedCopy.nearlyLinearWitness = false;
            setAlgorithmsSelected(algorithmsSelectedCopy);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);
    return (
        <>
            <Route path={"/headless/input"}>
                <h2>Headless mode</h2>
                <AlgorithmModeSwitch
                    mode={mode}
                    callback={(m) => {
                        setMode(m);
                    }}
                />
                <AlgorithmPicker
                    mode={mode}
                    algorithmsSelected={algorithmsSelected}
                    setAlgorithmsSelected={setAlgorithmsSelected}
                />
                <AlgorithmInput
                    runLink={"/headless/run"}
                    runCallback={(input1, input2) => {
                        const algorithms: Algorithm[] = [];
                        if (algorithmsSelected.tableFilling) {
                            algorithms.push(new TableFillingAlgorithm(input1, input2));
                        }
                        if (algorithmsSelected.tableFillingWitness) {
                            algorithms.push(new TableFillingAlgorithm(input1, input2, true));
                        }
                        // todo: other algorithms
                        setAlgorithms(algorithms);
                    }}
                    mode={AlgorithmMode.EQUIVALENCE_TESTING}
                />
            </Route>
            <Route path={"/headless/run"}>
                <HeadlessModeRun algorithms={algorithms} />
            </Route>
        </>
    );
}
