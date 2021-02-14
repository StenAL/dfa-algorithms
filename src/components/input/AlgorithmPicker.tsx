import { AlgorithmMode, AlgorithmsSelected } from "../../types/Algorithm";

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
    return (
        <div>
            <h3>Choose algorithms</h3>
            <div className={"algorithm-picker"}>
                <label>
                    Table-Filling
                    <input
                        name={"table-filling"}
                        type={"checkbox"}
                        checked={algorithmsSelected.tableFilling}
                        onChange={() => toggleAlgorithm("tableFilling")}
                    />
                </label>
                <label
                    className={
                        mode === AlgorithmMode.STATE_MINIMIZATION ? "disabled-algorithm" : ""
                    }
                >
                    Table-Filling (witness)
                    <input
                        name={"table-filling-witness"}
                        type={"checkbox"}
                        disabled={mode === AlgorithmMode.STATE_MINIMIZATION}
                        checked={algorithmsSelected.tableFillingWitness}
                        onChange={() => toggleAlgorithm("tableFillingWitness")}
                    />
                </label>
                <label className={"disabled-algorithm"}>
                    n lg n Hopcroft
                    <input
                        name={"hopcroft"}
                        type={"checkbox"}
                        disabled={true}
                        checked={algorithmsSelected.hopcroft}
                        onChange={() => toggleAlgorithm("hopcroft")}
                    />
                </label>
                <label className={"disabled-algorithm"}>
                    n lg n Hopcroft (witness)
                    <input
                        name={"hopcroft-witness"}
                        type={"checkbox"}
                        disabled={true}
                        checked={algorithmsSelected.hopcroftWitness}
                        onChange={() => toggleAlgorithm("hopcroftWitness")}
                    />
                </label>
                <label
                    className={
                        "disabled-algorithm " +
                        (mode === AlgorithmMode.STATE_MINIMIZATION ? "disabled-algorithm" : "")
                    }
                >
                    (Nearly) Linear
                    <input
                        name={"nearly-linear"}
                        type={"checkbox"}
                        disabled={true /*mode === AlgorithmMode.STATE_MINIMIZATION*/}
                        checked={algorithmsSelected.nearlyLinear}
                        onChange={() => toggleAlgorithm("nearlyLinear")}
                    />
                </label>
                <label
                    className={
                        "disabled-algorithm " +
                        (mode === AlgorithmMode.STATE_MINIMIZATION ? "disabled-algorithm" : "")
                    }
                >
                    (Nearly) Linear (witness)
                    <input
                        name={"nearly-linear-witness"}
                        type={"checkbox"}
                        disabled={true /*mode === AlgorithmMode.STATE_MINIMIZATION*/}
                        checked={algorithmsSelected.nearlyLinearWitness}
                        onChange={() => toggleAlgorithm("nearlyLinearWitness")}
                    />
                </label>
            </div>
        </div>
    );
}
