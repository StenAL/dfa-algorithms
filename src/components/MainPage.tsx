import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import DatasetGeneration from "./datasets/DatasetGeneration";
import HeadlessMode from "./headless/HeadlessMode";
import Help from "./Help";
import AlgorithmVisualization from "./visualization/AlgorithmVisualization";

export default function MainPage() {
    return (
        <Router>
            <div className={"content"}>
                <Link to={"/"}>
                    <h1>DFA algorithms</h1>
                </Link>
                <div className={"page-container"}>
                    <Route path={"/"} exact={true}>
                        <h2>What do you want to do?</h2>
                        <h3>Visualize algorithms</h3>
                        <p>
                            <Link to={"/algorithm/table-filling/input"}>
                                Table-Filling Algorithm
                            </Link>
                        </p>
                        <p>
                            <Link to={"/algorithm/hopcroft/input"}>n-lg-n Hopcroft Algorithm</Link>
                        </p>
                        <p>
                            <Link to={"/algorithm/nearly-linear/input"}>
                                (Nearly) Linear Algorithm
                            </Link>
                        </p>
                        <h3>Compare algorithm runtimes</h3>
                        <p>
                            <Link to={"/headless/input"}>Run headless mode</Link>
                        </p>
                        <h3>Generate DFAs</h3>
                        <p>
                            <Link to={"/datasets/input"}>Dataset generation</Link>
                        </p>
                        <h3>Learn about this app</h3>
                        <p>
                            <Link to={"/help"}>Help</Link>
                        </p>
                    </Route>
                </div>
                <Route path={"/algorithm/:algorithmType/"}>
                    <AlgorithmVisualization />
                </Route>
                <Route path={"/headless/"}>
                    <HeadlessMode />
                </Route>
                <Route path={"/datasets/"}>
                    <DatasetGeneration />
                </Route>
                <Route path={"/help"}>
                    <Help />
                </Route>
            </div>
            <footer>
                This webapp is <a href={"https://github.com/StenAL/dfa-algorithms"}>open-source</a>
            </footer>
        </Router>
    );
}
