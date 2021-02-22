import md5 from "md5";
import { DFA } from "../../../types/DFA";
import { serializeDfa } from "../../../util/util";

interface DownloadButtonProps {
    disabled: boolean;
    text: string;
    dfa1: DFA;
    dfa2: DFA | undefined;
}

export default function DownloadButton({ disabled, text, dfa1, dfa2 }: DownloadButtonProps) {
    return (
        <button
            disabled={disabled}
            onClick={() => {
                const json1 = JSON.stringify(serializeDfa(dfa1!));
                const json2 = dfa2 ? JSON.stringify(serializeDfa(dfa2!)) : "0";
                const result = JSON.stringify({ input1: json1, input2: json2 });
                const file = new Blob([result], { type: "json" });

                const fakeLink = document.createElement("a");
                fakeLink.href = URL.createObjectURL(file);
                fakeLink.download = `dfa-${md5(result)}.json`;
                fakeLink.click();
            }}
        >
            {text}
        </button>
    );
}
