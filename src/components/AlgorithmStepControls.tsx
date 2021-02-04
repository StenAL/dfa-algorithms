import { TableFillingAlgorithmState } from "../algorithm/TableFillingAlgorithm";
import { Algorithm } from "../types/Algorithm";

interface AlgorithmStepControlsProps {
    algorithm: Algorithm;
    stepForwardCallback: () => void;
}

export default function AlgorithmStepControls({
    algorithm,
    stepForwardCallback,
}: AlgorithmStepControlsProps) {
    return (
        <div className={"step-controls"}>
            <button disabled={true}>{"<"}</button>
            <button
                disabled={algorithm.state === TableFillingAlgorithmState.FINAL}
                onClick={() => {
                    algorithm.step();
                    stepForwardCallback();
                }}
            >
                {">"}
            </button>
        </div>
    );
}
