import { Algorithm, CommonAlgorithmState } from "../../types/Algorithm";

interface AlgorithmStepControlsProps {
    algorithm: Algorithm;
    stepBackwardCallback: () => void;
    stepForwardCallback: () => void;
}

export default function AlgorithmStepControls({
    algorithm,
    stepBackwardCallback,
    stepForwardCallback,
}: AlgorithmStepControlsProps) {
    return (
        <div className={"step-controls"}>
            <button
                disabled={algorithm.state === CommonAlgorithmState.INITIAL}
                onClick={() => {
                    algorithm.reset();
                    stepBackwardCallback();
                }}
            >
                {"<<"}
            </button>
            <button
                disabled={true}
                onClick={() => {
                    // todo: step backwards
                    stepBackwardCallback();
                }}
            >
                {"<"}
            </button>
            <button
                disabled={algorithm.state === CommonAlgorithmState.FINAL}
                onClick={() => {
                    algorithm.step();
                    stepForwardCallback();
                }}
            >
                {">"}
            </button>
            <button
                disabled={algorithm.state === CommonAlgorithmState.FINAL}
                onClick={() => {
                    while (algorithm.state !== CommonAlgorithmState.FINAL) {
                        algorithm.step();
                        stepForwardCallback();
                    }
                }}
            >
                {">>"}
            </button>
        </div>
    );
}
