import { Algorithm } from "../../types/Algorithm";

interface HeadlessModeRunProps {
    algorithms: Algorithm[];
}

export default function HeadlessModeRun({ algorithms }: HeadlessModeRunProps) {
    return <div>Soon {algorithms.map((a) => a.type).join(", ")}</div>;
}
