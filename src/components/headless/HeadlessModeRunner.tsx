import { useState } from "react";
import { Algorithm } from "../../types/Algorithm";

interface HeadlessModeRunProps {
    algorithms: Algorithm[];
}

export default function HeadlessModeRunner({ algorithms }: HeadlessModeRunProps) {
    const [log, setLog] = useState<string[]>([]);
    const start = () => {
        for (let algorithm of algorithms) {
            setLog((p) => p.concat(`Running ${algorithm.type}...`));
            const start = Date.now();
            setLog((p) => p.concat(`Start: ${start.toString()}`));
            algorithm.run();
            const end = Date.now();
            setLog((p) => p.concat(`End: ${end.toString()}`));
            setLog((p) => p.concat(`Duration: ${(end - start).toString()} ms`));
        }
    };

    const messageViews = log
        .slice()
        .reverse()
        .map((m, i) => {
            return <p key={`${m}-${i}`}>{m}</p>;
        });
    return (
        <div>
            <p>Selected algorithms: {algorithms.map((a) => a.type).join(", ")}</p>
            <button onClick={start}>Start</button>
            <div className={"log"}>{messageViews}</div>
        </div>
    );
}
