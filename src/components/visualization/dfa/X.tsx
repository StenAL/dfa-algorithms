import noam from "noam";
import { preGeneratedDatasets } from "../../../algorithm/data/datasets";
import { exampleDfa1, exampleDfa2 } from "../../../algorithm/data/exampleData";
import { DFA } from "../../../types/DFA";
import { dfaToNoamInput } from "../../../util/util";
import DfaVisualization from "./DfaVisualization";

export default function X() {
    const [input1, input2] = preGeneratedDatasets.sprawling;
    return (
        <div>
            <DfaVisualization
                initialState={input1.startingState.name}
                dfaString={dfaToNoamInput(input1)}
            />
            <DfaVisualization
                initialState={input2!.startingState.name}
                dfaString={dfaToNoamInput(input2!)}
            />
        </div>
    );
}
