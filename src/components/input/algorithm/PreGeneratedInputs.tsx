import { Link } from "react-router-dom";
import { dfaA, dfaB } from "../../../algorithm/data";
import { AlgorithmMode } from "../../../types/Algorithm";
import { DFA } from "../../../types/DFA";

interface PreGeneratedInputsProps {
    mode: AlgorithmMode;
    runLink: string;
    runCallback: (input1: DFA, input2: DFA | undefined) => void;
}

export default function PreGeneratedInputs({
    mode,
    runCallback,
    runLink,
}: PreGeneratedInputsProps) {
    return (
        <div className={"pre-generated-inputs"}>
            <Link to={runLink}>
                <button
                    onClick={() =>
                        runCallback(
                            dfaA,
                            mode === AlgorithmMode.EQUIVALENCE_TESTING ? dfaB : undefined
                        )
                    }
                >
                    Example inputs
                </button>
            </Link>
            <Link to={runLink} className={"disabled-link"}>
                <button disabled={true}>More to come</button>
            </Link>
        </div>
    );
}
