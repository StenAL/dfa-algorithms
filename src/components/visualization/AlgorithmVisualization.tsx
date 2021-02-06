import { useState } from "react";
import { Route, useParams } from "react-router-dom";
import TableFillingAlgorithm from "../../algorithm/TableFillingAlgorithm";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";
import InputContainer from "../input/InputContainer";
import TableFillingAlgorithmVisualization from "../TableFillingAlgorithmVisualization";
import { Algorithm, AlgorithmMode, AlgorithmType } from "../../types/Algorithm";
import { useForceUpdate } from "../../util/Hooks";

interface AlgorithmVisualizationRouteParams {
    algorithmType: AlgorithmType;
}

export default function AlgorithmVisualization() {
    const [algorithm, setAlgorithm] = useState<Algorithm>();
    const { algorithmType } = useParams<AlgorithmVisualizationRouteParams>();
    const forceUpdate = useForceUpdate();

    let visualization: JSX.Element | undefined = undefined;
    let title: string = "";
    let algorithmModes: AlgorithmMode[] = [];
    switch (algorithmType) {
        case "table-filling":
            title = "The Table-Filling Algorithm";
            algorithmModes = [
                AlgorithmMode.EQUIVALENCE_TESTING,
                AlgorithmMode.STATE_MINIMIZATION,
            ];
            visualization = (
                <TableFillingAlgorithmVisualization
                    algorithm={algorithm as TableFillingAlgorithm}
                />
            );
            break;
        case "hopcroft":
            title = "Hopcroft";
            algorithmModes = [
                AlgorithmMode.EQUIVALENCE_TESTING,
                AlgorithmMode.STATE_MINIMIZATION,
            ];
            break;
        case "other":
            title = "Other";
            algorithmModes = [];
    }
    return (
        <>
            <h2>{title}</h2>
            <Route path={"/algorithm/:algorithmType/input"}>
                <InputContainer
                    modes={algorithmModes}
                    runLink={`/algorithm/${algorithmType}/run`}
                    runCallback={(input1, input2) => {
                        switch (algorithmType) {
                            case "table-filling":
                                setAlgorithm(
                                    new TableFillingAlgorithm(input1, input2)
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
