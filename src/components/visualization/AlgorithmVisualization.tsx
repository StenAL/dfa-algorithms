import { useState } from "react";
import { Route, useParams } from "react-router-dom";
import TableFillingAlgorithm from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, AlgorithmMode } from "../../types/Algorithm";
import { useForceUpdate } from "../../util/Hooks";
import AlgorithmModeSwitch from "../input/AlgorithmModeSwitch";
import AlgorithmInput from "../input/AlgorithmInput";
import WitnessSwitch from "../input/WitnessSwitch";
import TableFillingAlgorithmVisualization from "../TableFillingAlgorithmVisualization";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";

interface AlgorithmVisualizationRouteParams {
    algorithmType: "table-filling" | "hopcroft" | "nearly-linear";
}

export default function AlgorithmVisualization() {
    const [algorithm, setAlgorithm] = useState<Algorithm>();
    const { algorithmType } = useParams<AlgorithmVisualizationRouteParams>();
    const forceUpdate = useForceUpdate();
    const [mode, setMode] = useState<AlgorithmMode>(AlgorithmMode.EQUIVALENCE_TESTING);
    const [produceWitness, setProduceWitness] = useState(false);

    let visualization: JSX.Element | undefined = undefined;
    let title: string = "";
    let supportedModes: AlgorithmMode[] = [];
    switch (algorithmType) {
        case "table-filling":
            title = "The Table-Filling Algorithm";
            supportedModes = [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
            visualization = (
                <TableFillingAlgorithmVisualization
                    algorithm={algorithm as TableFillingAlgorithm}
                />
            );
            break;
        case "hopcroft":
            title = "The n-lg-n Hopcroft Algorithm";
            supportedModes = [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
            break;
        case "nearly-linear":
            title = "The (Nearly) Linear Algorithm";
            supportedModes = [];
    }
    return (
        <>
            <h2>{title}</h2>
            <Route path={"/algorithm/:algorithmType/input"}>
                {supportedModes.length > 1 ? (
                    <AlgorithmModeSwitch
                        mode={mode}
                        callback={(m) => {
                            setMode(m);
                        }}
                    />
                ) : (
                    ""
                )}
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                    <WitnessSwitch produceWitness={produceWitness} callback={setProduceWitness} />
                ) : (
                    ""
                )}
                <AlgorithmInput
                    mode={mode}
                    runLink={`/algorithm/${algorithmType}/run`}
                    runCallback={(input1, input2) => {
                        switch (algorithmType) {
                            case "table-filling":
                                setAlgorithm(
                                    new TableFillingAlgorithm(input1, input2, produceWitness)
                                );
                                break;
                            case "hopcroft":
                                break;
                            case "nearly-linear":
                                break;
                        }
                    }}
                />
            </Route>
            <Route path={"/algorithm/:algorithmType/run"}>
                <div className={"algorithm-container"}>
                    <AlgorithmLog algorithm={algorithm!} />
                    {visualization}
                    <AlgorithmStepControls
                        algorithm={algorithm!}
                        stepBackwardCallback={() => forceUpdate()}
                        stepForwardCallback={() => forceUpdate()}
                    />
                </div>
            </Route>
        </>
    );
}
