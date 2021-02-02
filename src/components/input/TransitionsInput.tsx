import {useState} from "react";
import {Transitions} from "../../types/DFA"

interface TransitionsInputProps {
    states: string[];
    alphabet: string[];
    transitions: Map<string, Map<string, string>>;
    setTransition: (from: string, symbol: string, to: string) => boolean; // return boolean indicating whether transition is valid
}

export default function TransitionsInput({states, alphabet, transitions, setTransition}: TransitionsInputProps) {
    const rows: string[][] = [];
    let row: string[] = [""]
    for (let state of states) {
        row.push(state);
    }
    rows.push(row);
    row = []

    for (let symbol of alphabet) {
        row.push(symbol)
        for (let state of states) {
            row.push(state)
        }
        rows.push(row)
        row = []
    }

    console.log(rows)
    const elements = rows.map((row, j) =>
        <div className={"transition-row"}>
            {row.map((el, i) => {
                const header = i === 0 || j === 0;
                const symbol = rows[j][0];
                const from = rows[j][i];
                const to = transitions.get(from)?.get(symbol) ?? "";
                return (<div className={"transition-cell" + (header ? " transition-header" : "")} key={`${i}-${j}`}>
                    {header ? el : <input type={"text"} className={(states.includes(to) ? "" : "invalid-input")}
                                          placeholder={states.length > 0 ? states[0] : "q0"}
                                          value={to}
                                          onChange={(event) => setTransition(from, symbol, event.target.value)}/>}
                </div>)
            })}
        </div>)

    return (<div className={"transitions"}>{elements}</div>)
}