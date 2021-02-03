import TableFillingAlgorithm from "../algorithm/TableFillingAlgorithm";
import AlgorithmVisualization from "./AlgorithmVisualization";
import {dfaA, dfaB} from "../algorithm/data"
import DfaInput from "./input/DfaInput";
import React from "react";
import {
    BrowserRouter as Router,
    Link,
    Route
} from "react-router-dom";
import TableFillingAlgorithmVisualizationContainer from "./TableFillingAlgorithmVisualizationContainer";

export default function MainPage() {
    // const tableFillingAlgorithm = new TableFillingAlgorithm(dfaA, dfaB)
    return (<Router>
        <div>
            <Link to={"/"}><h1>DFA algorithms</h1></Link>
            <Route path={"/"} exact={true}>
                <h2>What do you want to run?</h2>
                <Link to={"/table-filling/input"}>Table-filling algorithm</Link>
            </Route>
            <Route path={"/table-filling/"}>
                <TableFillingAlgorithmVisualizationContainer/>
                {/*<AlgorithmVisualization algorithm={tableFillingAlgorithm}/>*/}
            </Route>
        </div>
    </Router>)
}