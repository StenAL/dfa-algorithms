import { useState } from "react";
import { Route, useParams } from "react-router-dom";
import TableFillingAlgorithm from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, AlgorithmMode, AlgorithmType } from "../../types/Algorithm";
import { useForceUpdate } from "../../util/Hooks";
import AlgorithmModeSwitch from "../input/AlgorithmModeSwitch";
import AlgorithmInput from "../input/AlgorithmInput";
import WitnessSwitch from "../input/WitnessSwitch";
import TableFillingAlgorithmVisualization from "../TableFillingAlgorithmVisualization";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";

interface AlgorithmVisualizationRouteParams {
    algorithmType: AlgorithmType;
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
            title = "Hopcroft";
            supportedModes = [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
            break;
        case "other":
            title = "Other";
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
                            case "other":
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
