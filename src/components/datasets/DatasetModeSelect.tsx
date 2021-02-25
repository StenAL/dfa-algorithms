import { default as Tooltip } from "react-tooltip";
import { DatasetType } from "../../types/Dataset";
import { getDatasetTypeDescription, getDatasetTypeName } from "../../util/util";

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
            <>
                <label key={`dataset-select-${datasetType}`}>
                    <input
                        type={"radio"}
                        name={`dataset-mode-${statePrefix}`}
                        checked={generationMode === datasetType}
                        onChange={() => callback(datasetType)}
                    />
                    {getDatasetTypeName(datasetType)}
                    <span className={"info-tooltip"} data-tip data-for={`${datasetType}-help`}>
                        ?
                    </span>
                </label>
                <Tooltip
                    place={"top"}
                    type={"info"}
                    id={`${datasetType}-help`}
                    effect={"solid"}
                    multiline={true}
                >
                    <span>
                        {getDatasetTypeDescription(datasetType)
                            .split(". ")
                            .map((s) => (
                                <>
                                    {s.replace(".", "")}.<br />
                                </>
                            ))}
                    </span>
                </Tooltip>
            </>
        ));
    return <div className={"dataset-mode-select"}>{options}</div>;
}
