import {Algorithm} from "../types/Algorithm";

interface AlgorithmStepControlsProps {
    algorithm: Algorithm
    stepForwardCallback: () => void;
}

export default function AlgorithmStepControls({algorithm, stepForwardCallback}: AlgorithmStepControlsProps) {
    return <div className={"step-controls"}>
        <button>{"<"}</button>
        <button onClick={() => {
            algorithm.step()
            stepForwardCallback()
        }}>{">"}</button>
    </div>
}