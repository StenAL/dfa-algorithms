import { DatasetType } from "../../types/Dataset";
import { getDatasetTypeName } from "../../util/util";

interface DatasetModeSelectProps {
    statePrefix: string;
    generationMode: DatasetType;
    callback: (datasetType: DatasetType) => void;
}

export default function DatasetModeSelect({
    statePrefix,
    generationMode,
    callback,
}: DatasetModeSelectProps) {
    const options = Object.keys(DatasetType)
        .map((el) => parseInt(el))
        .filter((k) => !isNaN(k))
        .map((datasetType) => (
            <label key={`dataset-select-${datasetType}`}>
                <input
                    type={"radio"}
                    name={`dataset-mode-${statePrefix}`}
                    checked={generationMode === datasetType}
                    onChange={() => callback(datasetType)}
                />
                {getDatasetTypeName(datasetType)}
            </label>
        ));
    return <div className={"dataset-mode-select"}>{options}</div>;
}
