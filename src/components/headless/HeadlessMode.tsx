import { useEffect, useState } from "react";
import { Route, useLocation } from "react-router-dom";
import { HopcroftAlgorithmImpl } from "../../algorithm/HopcroftAlgorithm";
import { NearlyLinearAlgorithmImpl } from "../../algorithm/NearlyLinearAlgorithm";
import { TableFillingAlgorithmImpl } from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, AlgorithmMode, AlgorithmsSelected } from "../../types/Algorithm";
import { DFA } from "../../types/DFA";
import { deserializeDfa } from "../../util/util";
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
    const location = useLocation();
    const [existingInput1, setExistingInput1] = useState<DFA | undefined>();
    const [existingInput2, setExistingInput2] = useState<DFA | undefined>();
    useEffect(() => {
        if (location.search.length > 0) {
            const serialized = location.search.substr(1);
            const inputs = serialized.split(";");
            setExistingInput1(deserializeDfa(JSON.parse(inputs[0])));

            if (inputs.length === 2) {
                setExistingInput2(deserializeDfa(JSON.parse(inputs[1])));
                setMode(AlgorithmMode.EQUIVALENCE_TESTING);
            } else {
                setMode(AlgorithmMode.STATE_MINIMIZATION);
            }
        }
    }, [location.search]);

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
                        existingInput1={existingInput1}
                        existingInput2={existingInput2}
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
                            if (algorithmsSelected.nearlyLinear) {
                                algorithms.push(new NearlyLinearAlgorithmImpl(input1, input2!));
                            }
                            if (algorithmsSelected.nearlyLinearWitness) {
                                algorithms.push(
                                    new NearlyLinearAlgorithmImpl(input1, input2!, true)
                                );
                            }
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
