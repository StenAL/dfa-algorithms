import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AlgorithmVisualization from "./visualization/AlgorithmVisualization";

export default function MainPage() {
    return (
        <Router>
            <div>
                <Link to={"/"}>
                    <h1>DFA algorithms</h1>
                </Link>
                <Route path={"/"} exact={true}>
                    <h2>What do you want to do?</h2>
                    <h3>Visualize algorithms</h3>
                    <Link to={"/algorithm/table-filling/input"}>
                        Table-filling algorithm
                    </Link>
                    <h3>Compare algorithms</h3>
                    <p>Headless mode coming soon...</p>
                </Route>
                <Route path={"/algorithm/:algorithmType/"}>
                    <AlgorithmVisualization />
                </Route>
            </div>
        </Router>
    );
}
