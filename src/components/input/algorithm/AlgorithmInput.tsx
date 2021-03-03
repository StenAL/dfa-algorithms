import _ from "lodash";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AlgorithmMode } from "../../../types/Algorithm";
import { DFA } from "../../../types/DFA";
import { dfaToNoamInput } from "../../../util/util";
import DfaVisualization from "../../visualization/dfa/DfaVisualization";
import AlphabetInput from "../dfa/AlphabetInput";
import DfaInput from "../dfa/DfaInput";
import DownloadButton from "./DownloadButton";
import PreGeneratedInputs from "./PreGeneratedInputs";

interface AlgorithmInputProps {
    mode: AlgorithmMode;
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
    runLink: string;
}

export default function AlgorithmInput({ mode, runCallback, runLink }: AlgorithmInputProps) {
    const [input1, setInput1] = useState<DFA>();
    const [input2, setInput2] = useState<DFA>();
    const [alphabet, setAlphabet] = useState<string[]>([]);
    const alphabetValid = alphabet.length > 0 && new Set(alphabet).size === alphabet.length;

    let input1Valid = input1 !== undefined;
    let input2Valid = input2 !== undefined;
    let inputValid = true;
    if (mode === AlgorithmMode.EQUIVALENCE_TESTING && input1Valid && input2Valid) {
        for (let state of input1!.states) {
            const transitionKeys = new Set(state.transitions.keys());
            input1Valid = input1Valid && alphabet.every((symbol) => transitionKeys.has(symbol));
        }
        for (let state of input2!.states) {
            const transitionKeys = new Set(state.transitions.keys());
            input2Valid = input2Valid && alphabet.every((symbol) => transitionKeys.has(symbol));
        }
        inputValid = inputValid && input2Valid;
    } else if (mode === AlgorithmMode.STATE_MINIMIZATION && input1) {
        for (let state of input1.states) {
            const transitionKeys = new Set(state.transitions.keys());
            input1Valid = input1Valid && alphabet.every((symbol) => transitionKeys.has(symbol));
        }
    } else {
        inputValid = false;
    }
    inputValid = inputValid && input1Valid;

    return (
        <div className={"page-container"}>
            <h3>Use a pre-generated input:</h3>
            <PreGeneratedInputs
                mode={mode}
                runCallback={(input1, input2) => {
                    setAlphabet(_.cloneDeep(input1.alphabet));
                    setInput1(_.cloneDeep(input1));
                    setInput2(_.cloneDeep(input2));
                }}
            />
            <h3>
                ... or input {mode === AlgorithmMode.STATE_MINIMIZATION ? "a" : ""} custom DFA
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? "s" : ""}
            </h3>
            <AlphabetInput
                alphabet={alphabet}
                callback={(newAlphabet) => {
                    const newSymbols = newAlphabet.filter((symbol) => !alphabet.includes(symbol));
                    const removedSymbols = alphabet.filter(
                        (symbol) => !newAlphabet.includes(symbol)
                    );
                    setAlphabet(newAlphabet);
                    if (newSymbols.length === 0) {
                        if (input1) {
                            const input1Copy = _.cloneDeep(input1);
                            for (let state of input1Copy.states) {
                                removedSymbols.forEach((symbol) =>
                                    state.transitions.delete(symbol)
                                );
                            }
                            input1Copy.alphabet = newAlphabet;
                            setInput1(input1Copy);
                        }
                        if (input2) {
                            const input2Copy = _.cloneDeep(input2);
                            for (let state of input2Copy.states) {
                                removedSymbols.forEach((symbol) =>
                                    state.transitions.delete(symbol)
                                );
                            }
                            input2Copy.alphabet = newAlphabet;
                            setInput2(input2Copy);
                        }
                    }
                }}
            />

            <div className={"dfa-inputs-container"}>
                <div className={"input-visualization-container"}>
                    <DfaInput
                        convertInputCallback={(dfa) => {
                            setInput1(dfa);
                            if (dfa) {
                                setAlphabet(dfa.alphabet);
                            }
                        }}
                        existingStates={input1 ? input1.states.map((s) => s.name) : []}
                        existingFinalStates={
                            input1 ? Array.from(input1.finalStates).map((s) => s.name) : []
                        }
                        existingTransitions={
                            input1
                                ? input1.states
                                      .map((s) => {
                                          const r: string[][] = [];
                                          Array.from(s.transitions).forEach((entry) =>
                                              r.push([s.name, entry[0], entry[1].name])
                                          );
                                          return r as [string, string, string][];
                                      })
                                      .flat()
                                : []
                        }
                        alphabet={alphabet}
                        alphabetValid={alphabetValid}
                    />
                    <DownloadButton text={"Save to File"} dfa={input1} />
                    <DfaVisualization
                        initialState={input1 ? input1.startingState.name : ""}
                        dfaString={input1Valid ? dfaToNoamInput(input1!) : ""}
                    />
                </div>
                {mode === AlgorithmMode.EQUIVALENCE_TESTING ? (
                    <div className={"input-visualization-container"}>
                        <DfaInput
                            alphabet={alphabet}
                            existingStates={input2 ? input2.states.map((s) => s.name) : []}
                            existingFinalStates={
                                input2 ? Array.from(input2.finalStates).map((s) => s.name) : []
                            }
                            existingTransitions={
                                input2
                                    ? input2.states
                                          .map((s) => {
                                              const r: string[][] = [];
                                              Array.from(s.transitions).forEach((entry) =>
                                                  r.push([s.name, entry[0], entry[1].name])
                                              );
                                              return r as [string, string, string][];
                                          })
                                          .flat()
                                    : []
                            }
                            alphabetValid={alphabetValid}
                            convertInputCallback={(dfa) => {
                                setInput2(dfa);
                                if (dfa) {
                                    setAlphabet(dfa.alphabet);
                                }
                            }}
                        />
                        <DownloadButton text={"Save to File"} dfa={input2} />
                        <DfaVisualization
                            initialState={input2 ? input2.startingState.name : ""}
                            dfaString={input2Valid ? dfaToNoamInput(input2!) : ""}
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
            <Link className={inputValid ? "" : "disabled-link"} to={runLink}>
                <button disabled={!inputValid} onClick={() => runCallback(input1!, input2)}>
                    Run
                </button>
            </Link>
        </div>
    );
}
