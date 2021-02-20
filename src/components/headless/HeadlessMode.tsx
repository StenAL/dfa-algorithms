import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { HopcroftAlgorithmImpl } from "../../algorithm/HopcroftAlgorithm";
import { TableFillingAlgorithmImpl } from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, AlgorithmMode, AlgorithmsSelected } from "../../types/Algorithm";
import AlgorithmInput from "../input/algorithm/AlgorithmInput";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import AlgorithmPicker from "../input/algorithm/AlgorithmPicker";
import HeadlessModeRunner from "./HeadlessModeRunner";

export default function HeadlessMode() {
    const [mode, setMode] = useState(AlgorithmMode.EQUIVALENCE_TESTING);
    const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
    const [algorithmsSelected, setAlgorithmsSelected] = useState<AlgorithmsSelected>({
        tableFilling: false,
        tableFillingWitness: false,
        hopcroft: false,
        hopcroftWitness: false,
        nearlyLinear: false,
        nearlyLinearWitness: false,
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
            <h2>Headless mode</h2>
            <Route path={"/headless/input"}>
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
                {Object.values(algorithmsSelected).filter((v) => v).length > 0 ? (
                    <AlgorithmInput
                        runLink={"/headless/run"}
                        mode={mode}
                        runCallback={(input1, input2) => {
                            const algorithms: Algorithm[] = [];
                            if (algorithmsSelected.tableFilling) {
                                algorithms.push(new TableFillingAlgorithmImpl(input1, input2));
                            }
                            if (algorithmsSelected.tableFillingWitness) {
                                algorithms.push(
                                    new TableFillingAlgorithmImpl(input1, input2, true)
                                );
                            }
                            if (algorithmsSelected.hopcroft) {
                                algorithms.push(new HopcroftAlgorithmImpl(input1, input2));
                            }
                            if (algorithmsSelected.hopcroftWitness) {
                                algorithms.push(new HopcroftAlgorithmImpl(input1, input2, true));
                            }
                            // todo: nearly linear algorithm
                            setAlgorithms(algorithms);
                        }}
                    />
                ) : (
                    ""
                )}
            </Route>
            <Route path={"/headless/run"}>
                <HeadlessModeRunner algorithms={algorithms} />
            </Route>
        </>
    );
}
