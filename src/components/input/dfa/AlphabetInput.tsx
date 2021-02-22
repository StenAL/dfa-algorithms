import { default as Tooltip } from "react-tooltip";

interface AlphabetInputProps {
    alphabet: string[];
    callback: (alphabet: string[]) => void;
}

export default function AlphabetInput({ alphabet, callback }: AlphabetInputProps) {
    const alphabetValid = alphabet.length > 0 && new Set(alphabet).size === alphabet.length;
    return (
        <div className={"alphabet-input"}>
            <label htmlFor={"alphabet"}>
                Alphabet
                <span className={"info-tooltip"} data-tip data-for="alphabet-help">
                    ?
                </span>
            </label>
            <Tooltip
                place={"top"}
                type={"info"}
                id="alphabet-help"
                effect={"solid"}
                multiline={true}
            >
                <span>
                    The alphabet the DFA(s) will use in the form of a comma-separated list
                    <br /> e.g. '0,1,2' or 'a,b'. Can not contain duplicate symbols
                </span>
            </Tooltip>
            <input
                name={"alphabet"}
                type={"text"}
                placeholder={"0,1,..."}
                defaultValue={alphabet.length > 0 ? alphabet.join(",") : undefined}
                onChange={(event) => {
                    const newAlphabet = event.target.value.split(",");
                    if (newAlphabet.length > 0 && newAlphabet[newAlphabet.length - 1] === "") {
                        newAlphabet.pop();
                    }
                    callback(newAlphabet);
                }}
                className={alphabetValid ? "" : "invalid-input"}
            />
        </div>
    );
}
