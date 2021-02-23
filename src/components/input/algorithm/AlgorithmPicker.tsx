import { AlgorithmMode, AlgorithmsSelected, AlgorithmType } from "../../../types/Algorithm";
import { getAlgorithmModes, getAlgorithmName } from "../../../util/util";

interface AlgorithmsPickerProps {
    mode: AlgorithmMode;
    algorithmsSelected: AlgorithmsSelected;
    setAlgorithmsSelected: (algorithmsSelected: AlgorithmsSelected) => void;
}

export default function AlgorithmPicker({
    mode,
    algorithmsSelected,
    setAlgorithmsSelected,
}: AlgorithmsPickerProps) {
    const toggleAlgorithm = (algorithm: keyof AlgorithmsSelected) => {
        const algorithmsSelectedCopy = { ...algorithmsSelected };
        algorithmsSelectedCopy[algorithm] = !algorithmsSelectedCopy[algorithm];
        setAlgorithmsSelected(algorithmsSelectedCopy);
    };

    const inputs = (Object.keys(algorithmsSelected) as AlgorithmType[]).map((algorithmType) => {
        let disabledInput =
            !getAlgorithmModes(algorithmType).includes(AlgorithmMode.STATE_MINIMIZATION) &&
            mode === AlgorithmMode.STATE_MINIMIZATION;
        disabledInput = disabledInput || algorithmType === "nearlyLinearWitness";
        return (
            <label key={algorithmType} className={disabledInput ? "disabled-algorithm" : ""}>
                {getAlgorithmName(algorithmType).replace(" Algorithm", "")}
                <input
                    name={algorithmType}
                    type={"checkbox"}
                    checked={algorithmsSelected[algorithmType]}
                    onChange={() => toggleAlgorithm(algorithmType)}
                    disabled={disabledInput}
                />
            </label>
        );
    });

    return (
        <div>
            <h3>Choose algorithms</h3>
            <div className={"algorithm-picker"}>{inputs}</div>
        </div>
    );
}
