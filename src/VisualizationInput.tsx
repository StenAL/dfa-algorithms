import noam from "noam";
import React, { useState } from "react";
import DfaVisualization from "./components/visualization/dfa/DfaVisualization";

export default function VisualizationInput() {
    const [automaton, setAutomaton] = useState();
    const [dfaInput, setDfaInput] = useState("");

    function validateNoamDfa(input: string) {
        try {
            noam.fsm.parseFsmFromString(input);
            return true;
        } catch (e) {
            console.log("invalid input");
            return false;
        }
    }

    return (
        <>
            <div>
                <div>
                    <button
                        onClick={() => {
                            const automaton = noam.fsm.createRandomFsm(noam.fsm.dfaType, 5, 2, 3);
                            setAutomaton(automaton);
                            setDfaInput(noam.fsm.serializeFsmToString(automaton));
                        }}
                    >
                        Generate random DFA
                    </button>
                    <textarea
                        placeholder="or write your own"
                        spellCheck="false"
                        value={dfaInput}
                        onChange={(e) => {
                            const newString = e.target.value;
                            setDfaInput(newString);
                            if (validateNoamDfa(newString)) {
                                setAutomaton(noam.fsm.parseFsmFromString(newString));
                            }
                        }}
                    />
                    <button
                        disabled={true}
                        onClick={async function () {
                            setAutomaton(noam.fsm.parseFsmFromString(dfaInput));
                        }}
                    >
                        Create automaton
                    </button>
                </div>
            </div>
            <DfaVisualization
                dfaString={automaton ? noam.fsm.printDotFormat(automaton) : ""}
                //@ts-ignore
                initialState={automaton ? automaton!.initialState : ""}
            />
        </>
    );
}
