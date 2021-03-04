import { useEffect, useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
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
import AlgorithmInput from "../input/algorithm/AlgorithmInput";
import AlgorithmModeSwitch from "../input/algorithm/AlgorithmModeSwitch";
import WitnessSwitch from "../input/algorithm/WitnessSwitch";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";
import DfaVisualization from "./dfa/DfaVisualization";
import HopcroftAlgorithmVisualization from "./HopcroftAlgorithmVisualization";
import NearlyLinearAlgorithmVisualization from "./NearlyLinearAlgorithmVisualization";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";

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

    useEffect(() => {
        if (algorithmType === "nearly-linear") {
            setMode(AlgorithmMode.EQUIVALENCE_TESTING);
        }
    }, [algorithmType]);

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
            <Route path={"/algorithm/:algorithmType/input"}>
                <h3>Wish to visualize a different algorithm?</h3>
                {algorithmType !== "table-filling" ? (
                    <p>
                        <Link to={"/algorithm/table-filling/input"}>
                            The Table-Filling Algorithm
                        </Link>
                    </p>
                ) : (
                    ""
                )}
                {algorithmType !== "hopcroft" ? (
                    <p>
                        <Link to={"/algorithm/hopcroft/input"}>The n lg n Hopcroft Algorithm</Link>
                    </p>
                ) : (
                    ""
                )}
                {algorithmType !== "nearly-linear" ? (
                    <p>
                        <Link to={"/algorithm/nearly-linear/input"}>
                            The (Nearly) Linear Algorithm
                        </Link>
                    </p>
                ) : (
                    ""
                )}
                <h3>Select mode</h3>
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
                                    className={
                                        mode === AlgorithmMode.STATE_MINIMIZATION
                                            ? "single-visualization"
                                            : "double-visualization"
                                    }
                                    initialState={algorithm!.input1.startingState.name}
                                    dfaString={dfaToNoamInput(algorithm!.input1)}
                                />
                                <DfaVisualization
                                    className={"double-visualization"}
                                    initialState={
                                        algorithm!.input2
                                            ? algorithm!.input2.startingState.name
                                            : ""
                                    }
                                    dfaString={
                                        algorithm.mode === AlgorithmMode.EQUIVALENCE_TESTING &&
                                        algorithm!.input2
                                            ? dfaToNoamInput(algorithm!.input2)
                                            : ""
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
