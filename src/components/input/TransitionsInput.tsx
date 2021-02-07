import { useEffect } from "react";
import { TransitionData } from "./DfaInput";

interface TransitionsInputProps {
    states: string[];
    alphabet: string[];
    transitions: TransitionData;
    setTransition: (from: string, symbol: string, to: string) => void;
    setTransitionsValid: (valid: boolean) => void;
}

export default function TransitionsInput({
    states,
    alphabet,
    transitions,
    setTransition,
    setTransitionsValid,
}: TransitionsInputProps) {
    const rows: string[][] = [];
    let row: string[] = [""];
    for (let state of states) {
        row.push(state);
    }
    rows.push(row);
    row = [];

    for (let symbol of alphabet) {
        row.push(symbol);
        for (let state of states) {
            row.push(state);
        }
        rows.push(row);
        row = [];
    }

    let transitionsValid = true;
    const elements = rows.map((row, j) => (
        <div className={"transition-row"} key={`${j}`}>
            {row.map((el, i) => {
                const header = i === 0 || j === 0;
                const symbol = rows[j][0];
                const from = rows[j][i];
                const to = transitions.get(from)?.get(symbol) ?? "";
                let validTo = header || states.includes(to);
                transitionsValid = transitionsValid && validTo;
                return (
                    <div
                        className={
                            "transition-cell" +
                            (header ? " transition-header" : "")
                        }
                        key={`${i}-${j}`}
                    >
                        {header ? (
                            el
                        ) : (
                            <input
                                type={"text"}
                                className={validTo ? "" : "invalid-input"}
                                placeholder={
                                    states.length > 0 ? states[0] : "q0"
                                }
                                value={to}
                                onChange={(event) =>
                                    setTransition(
                                        from,
                                        symbol,
                                        event.target.value
                                    )
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    ));
    useEffect(() => {
        setTransitionsValid(transitionsValid);
    });
    return (
        <div className={"transitions"}>
            <p className={"transitions-"}>Transitions</p>
            {elements}
        </div>
    );
}
