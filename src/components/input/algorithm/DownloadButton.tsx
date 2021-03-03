import md5 from "md5";
import { DFA } from "../../../types/DFA";
import { serializeDfa } from "../../../util/util";

interface DownloadButtonProps {
    text: string;
    dfa: DFA | undefined;
}

export default function DownloadButton({ text, dfa }: DownloadButtonProps) {
    return (
        <button
            disabled={!dfa}
            onClick={() => {
                const json = JSON.stringify(serializeDfa(dfa!));
                const file = new Blob([json], { type: "json" });

                const fakeLink = document.createElement("a");
                fakeLink.href = URL.createObjectURL(file);
                fakeLink.download = `dfa-${md5(json)}.json`;
                fakeLink.click();
            }}
        >
            {text}
        </button>
    );
}
