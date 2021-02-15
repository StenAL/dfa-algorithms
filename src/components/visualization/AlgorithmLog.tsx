import { useState } from "react";
import { Algorithm } from "../../types/Algorithm";

interface AlgorithmLogProps {
    algorithm: Algorithm;
}

export default function AlgorithmLog({ algorithm }: AlgorithmLogProps) {
    const [messages, setMessages] = useState<string[]>([]);
    algorithm.log = {
        log: (message) => setMessages((prevState) => prevState.concat(message)),
        clear: () => setMessages([]),
    };

    const messageViews = messages
        .slice()
        .reverse()
        .map((m) => {
            return <p key={m}>{m}</p>;
        });
    return <div className={"log"}>{messageViews}</div>;
}
