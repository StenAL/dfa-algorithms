import { preGeneratedDatasets } from "../../../algorithm/data/datasets";
import { AlgorithmMode } from "../../../types/Algorithm";
import { PreGeneratedDataset, PreGeneratedDatasetName } from "../../../types/Dataset";
import { DFA } from "../../../types/DFA";
import { getPreGeneratedDatasetPrintName } from "../../../util/util";

interface PreGeneratedInputsProps {
    mode: AlgorithmMode;
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
}

export default function PreGeneratedInputs({ mode, runCallback }: PreGeneratedInputsProps) {
    const links = (Object.entries(preGeneratedDatasets) as [
        PreGeneratedDatasetName,
        PreGeneratedDataset
    ][]).map(([name, dataset]) => (
        <button
            key={name}
            onClick={() =>
                runCallback(
                    dataset[0],
                    mode === AlgorithmMode.EQUIVALENCE_TESTING ? dataset[1] : undefined
                )
            }
        >
            {getPreGeneratedDatasetPrintName(name)}
        </button>
    ));

    return <div className={"pre-generated-inputs"}>{links}</div>;
}
