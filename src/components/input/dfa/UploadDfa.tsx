import { useState } from "react";
import { DFA } from "../../../types/DFA";
import { deserializeDfa } from "../../../util/util";

interface UploadDfaProps {
    callback: (dfa: DFA) => void;
}

export default function UploadDfa({ callback }: UploadDfaProps) {
    const [fileError, setFileError] = useState("");
    const [uid] = useState(Math.random() * 1000000);
    return (
        <div>
            <input
                type="file"
                id={`files-${uid}`}
                className={"file-input"}
                multiple={true}
                onChange={async (event) => {
                    try {
                        const file = event.target.files!.item(0)!;
                        const text = await file.text();
                        const dfa = deserializeDfa(JSON.parse(text));
                        setFileError("");
                        callback(dfa);
                    } catch (e) {
                        setFileError(e.message);
                    }
                }}
            />
            <div>
                <button className={"file-input-button"}>
                    <label htmlFor={`files-${uid}`} className={"file-input-label"}>
                        Select file...
                    </label>
                </button>
            </div>
            {fileError === "" ? (
                ""
            ) : (
                <span className={"invalid-indicator"}>Invalid input: {fileError}</span>
            )}
        </div>
    );
}
