import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import HeadlessMode from "./headless/HeadlessMode";
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
                    <Link to={"/algorithm/tableFilling/input"}>Table-filling algorithm</Link>
                    <h3>Compare algorithm runtimes</h3>
                    <Link to={"/headless/input"}>Run headless mode</Link>
                    <h3>Help/Info</h3>
                    <p>Coming soon</p>
                </Route>
                <Route path={"/algorithm/:algorithmType/"}>
                    <AlgorithmVisualization />
                </Route>
                <Route path={"/headless/"}>
                    <HeadlessMode />
                </Route>
            </div>
            <footer>
                This app is <a href={"https://github.com/StenAL/dfa-algorithms"}>open-source</a>
            </footer>
        </Router>
    );
}
