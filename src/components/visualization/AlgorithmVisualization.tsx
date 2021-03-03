import { useState } from "react";
import { Route, useParams } from "react-router-dom";
import { HopcroftAlgorithm, HopcroftAlgorithmImpl } from "../../algorithm/HopcroftAlgorithm";
import {
    NearlyLinearAlgorithm,
    NearlyLinearAlgorithmImpl,
} from "../../algorithm/NearlyLinearAlgorithm";
import {
    TableFillingAlgorithm,
    TableFillingAlgorithmImpl,
} from "../../algorithm/TableFillingAlgorithm";
import { Algorithm, AlgorithmMode } from "../../types/Algorithm";
import { useForceUpdate } from "../../util/hooks";
import { dfaToNoamInput, getAlgorithmModes, getAlgorithmName } from "../../util/util";
import DfaVisualization from "./dfa/DfaVisualization";
import HopcroftAlgorithmVisualization from "./HopcroftAlgorithmVisualization";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import AlgorithmInput from "../input/algorithm/AlgorithmInput";
import WitnessSwitch from "../input/algorithm/WitnessSwitch";
import NearlyLinearAlgorithmVisualization from "./NearlyLinearAlgorithmVisualization";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";

export type AlgorithmUrlString = "table-filling" | "hopcroft" | "nearly-linear";
interface AlgorithmVisualizationRouteParams {
    algorithmType: AlgorithmUrlString;
}

export default function AlgorithmVisualization() {
    const [algorithm, setAlgorithm] = useState<Algorithm>();
    const { algorithmType } = useParams<AlgorithmVisualizationRouteParams>();
    const forceUpdate = useForceUpdate();
    const [mode, setMode] = useState<AlgorithmMode>(AlgorithmMode.EQUIVALENCE_TESTING);
    const [produceWitness, setProduceWitness] = useState(false);

    let visualization: JSX.Element | undefined = undefined;
    const title = "The " + getAlgorithmName(algorithmType);
    const supportedModes: AlgorithmMode[] = getAlgorithmModes(algorithmType);

    switch (algorithmType) {
        case "table-filling":
            visualization = (
                <TableFillingAlgorithmVisualization
                    algorithm={algorithm as TableFillingAlgorithm}
                />
            );
            break;
        case "hopcroft":
            visualization = (
                <HopcroftAlgorithmVisualization algorithm={algorithm as HopcroftAlgorithm} />
            );
            break;
        case "nearly-linear":
            visualization = (
                <NearlyLinearAlgorithmVisualization
                    algorithm={algorithm as NearlyLinearAlgorithm}
                />
            );
            break;
    }
    return (
        <>
            <h2>{title}</h2>
            <p>todo: add buttons to switch algorithms here</p>
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
                                    new TableFillingAlgorithmImpl(input1, input2, produceWitness)
                                );
                                break;
                            case "hopcroft":
                                setAlgorithm(
                                    new HopcroftAlgorithmImpl(input1, input2, produceWitness)
                                );
                                break;
                            case "nearly-linear":
                                setAlgorithm(
                                    new NearlyLinearAlgorithmImpl(input1, input2!, produceWitness)
                                );
                                break;
                        }
                    }}
                />
            </Route>
            <Route path={"/algorithm/:algorithmType/run"}>
                <div className={"algorithm-container"}>
                    <AlgorithmLog algorithm={algorithm!} />
                    <AlgorithmStepControls
                        algorithm={algorithm!}
                        stepBackwardCallback={() => forceUpdate()}
                        stepForwardCallback={() => forceUpdate()}
                    />
                    {algorithm ? (
                        <div className={"algorithm-visualization-container"}>
                            {visualization}
                            <div className={"algorithm-input-visualization"}>
                                <DfaVisualization
                                    initialState={algorithm!.input1.startingState.name}
                                    dfaString={dfaToNoamInput(algorithm!.input1)}
                                />
                                <DfaVisualization
                                    initialState={
                                        algorithm!.input2
                                            ? algorithm!.input2.startingState.name
                                            : ""
                                    }
                                    dfaString={
                                        algorithm!.input2 ? dfaToNoamInput(algorithm!.input2) : ""
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </Route>
        </>
    );
}
