import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AlgorithmVisualization from "./visualization/AlgorithmVisualization";

export default function MainPage() {
    // test
    return (
        <Router>
            <div>
                <Link to={"/"}>
                    <h1>DFA algorithms</h1>
                </Link>
                <Route path={"/"} exact={true}>
                    <h2>What do you want to run?</h2>
                    <Link to={"/algorithm/table-filling/input"}>
                        Table-filling algorithm
                    </Link>
                </Route>
                <Route path={"/algorithm/:algorithmType/"}>
                    <AlgorithmVisualization />
                </Route>
            </div>
        </Router>
    );
}
