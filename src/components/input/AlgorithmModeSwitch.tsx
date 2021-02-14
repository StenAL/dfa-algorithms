import { default as Switch } from "react-switch";
import { AlgorithmMode } from "../../types/Algorithm";

interface AlgorithmModeSwitchProps {
    mode: AlgorithmMode;
    callback: (mode: AlgorithmMode) => void;
}

export default function AlgorithmModeSwitch({ mode, callback }: AlgorithmModeSwitchProps) {
    return (
        <div className={"algorithm-switch"}>
            <h3>Choose mode:</h3>
            <span className={"switch-option right-align"}>Equivalence testing</span>
            <Switch
                checked={mode === AlgorithmMode.STATE_MINIMIZATION}
                activeBoxShadow={"0 0 2px 2px #3bf"}
                onChange={() => {
                    mode === AlgorithmMode.EQUIVALENCE_TESTING
                        ? callback(AlgorithmMode.STATE_MINIMIZATION)
                        : callback(AlgorithmMode.EQUIVALENCE_TESTING);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                offHandleColor={"#89CFF0"}
                onHandleColor={"#89CFF0"}
                offColor={"#aaa"}
                onColor={"#aaa"}
                width={75}
            />
            <span className={"switch-option left-align"}>State minimization</span>
        </div>
    );
}
