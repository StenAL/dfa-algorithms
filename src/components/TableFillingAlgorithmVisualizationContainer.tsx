import { useState } from "react";
import { Route } from "react-router-dom";
import { dfaA, dfaB } from "../algorithm/data";
import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import { AlgorithmMode } from "../types/Algorithm";
import AlgorithmVisualization from "./AlgorithmVisualization";
import InputContainer from "./input/InputContainer";


export default function TableFillingAlgorithmVisualizationContainer() {
    const [algorithm, setAlgorithm] = useState<TableFillingAlgorithm>();
    return (
        <>
            <Route path={"/table-filling/input"}>
                <InputContainer modes={[AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.MINIMIZATION]}
                                runLink={"/table-filling/algorithm"} runCallback={(input1, input2) => {
                    setAlgorithm(new TableFillingAlgorithm(input1, input2!));
                }} />
            </Route>
            <Route path={"/table-filling/algorithm"}>
                <AlgorithmVisualization
                    algorithm={algorithm!}
                />
            </Route>
        </>
    );
}
