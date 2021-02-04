import React from "react";
import {
    BrowserRouter as Router,
    Link,
    Route
} from "react-router-dom";
import TableFillingAlgorithmVisualizationContainer from "./TableFillingAlgorithmVisualizationContainer";

export default function MainPage() {
    return (<Router>
        <div>
            <Link to={"/"}><h1>DFA algorithms</h1></Link>
            <Route path={"/"} exact={true}>
                <h2>What do you want to run?</h2>
                <Link to={"/table-filling/input"}>Table-filling algorithm</Link>
            </Route>
            <Route path={"/table-filling/"}>
                <TableFillingAlgorithmVisualizationContainer/>
            </Route>
        </div>
    </Router>)
}