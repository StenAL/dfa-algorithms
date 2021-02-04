import { default as Switch } from "react-switch";
import { AlgorithmMode } from "../../types/Algorithm";

interface AlgorithmModeSwitchProps {
    mode: AlgorithmMode;
    callback: (mode: AlgorithmMode) => void;
}

export default function AlgorithmModeSwitch({mode, callback} : AlgorithmModeSwitchProps) {
    return (<div className={"algorithm-mode-switch"}>
        <p>Choose mode:</p>
        <span className={"algorithm-mode-option"}>Equivalence testing</span>
        <Switch
            checked={mode === AlgorithmMode.MINIMIZATION}
            activeBoxShadow={'0 0 2px 2px #3bf'}
            onChange={() => {
                mode === AlgorithmMode.EQUIVALENCE_TESTING
                    ? callback(AlgorithmMode.MINIMIZATION)
                    : callback(AlgorithmMode.EQUIVALENCE_TESTING);
            }}
            checkedIcon={false}
            uncheckedIcon={false}
            offHandleColor={"#95E2FF"}
            onHandleColor={"#95E2FF"}
            offColor={"#888"}
            onColor={"#888"}
            width={75}
        />
        <span className={"algorithm-mode-option"}>State minimization</span>
    </div>)
}