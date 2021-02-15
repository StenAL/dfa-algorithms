import { Algorithm } from "../../types/Algorithm";

interface HeadlessModeRunProps {
    algorithms: Algorithm[];
}

export default function HeadlessModeRunner({ algorithms }: HeadlessModeRunProps) {
    return (
        <div>
            <p>Soon {algorithms.map((a) => a.type).join(", ")}</p>
        </div>
    );
}
