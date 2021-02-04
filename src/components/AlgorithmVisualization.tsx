import {useState} from "react";
import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import AlgorithmLog from "./AlgorithmLog";
import AlgorithmStepControls from "./AlgorithmStepControls";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";
import {Algorithm} from "../types/Algorithm";

interface AlgorithmVisualizationProps {
    algorithm: Algorithm;
}

function useForceUpdate() {
    const [, setValue] = useState(0);
    return () => setValue(value => value + 1); // update the state to force render
}

export default function AlgorithmVisualization({algorithm}: AlgorithmVisualizationProps) {
    const forceUpdate = useForceUpdate();
    let visualization = <p>Unsupported (so far)</p>
    let title = "Unspecified"
    switch (algorithm.type) {
        case "table-filling":
            visualization = <TableFillingAlgorithmVisualization algorithm={algorithm as TableFillingAlgorithm}/>
            title = "The Table-Filling Algorithm"
            break;
        case "other":
            visualization = <p>Unsupported</p>
            title = "Other"
    }
    return <div className={"algorithm-container"}>
        <h2>{title}</h2>
        <AlgorithmLog algorithm={algorithm}/>
        <div className={"algorithm-visualization"}>
            {visualization}
            <AlgorithmStepControls algorithm={algorithm} stepForwardCallback={() => forceUpdate()}/>
        </div>
    </div>
}