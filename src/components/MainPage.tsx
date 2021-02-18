import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import HeadlessMode from "./headless/HeadlessMode";
import Help from "./Help";
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
                    <p>
                        <Link to={"/algorithm/table-filling/input"}>Table-filling Algorithm</Link>
                    </p>
                    <p>
                        <Link to={"/algorithm/hopcroft/input"}>n-lg-n Hopcroft Algorithm</Link>
                    </p>
                    <h3>Compare algorithm runtimes</h3>
                    <p>
                        <Link to={"/headless/input"}>Run headless mode</Link>
                    </p>
                    <h3>Generate DFA datasets</h3>
                    <p>
                        Coming soon
                        {/*<Link to={"/help"}>**Coming soon**</Link>*/}
                    </p>
                    <h3>Learn about this app</h3>
                    <p>
                        <Link to={"/help"}>Help</Link>
                    </p>
                </Route>
                <Route path={"/algorithm/:algorithmType/"}>
                    <AlgorithmVisualization />
                </Route>
                <Route path={"/headless/"}>
                    <HeadlessMode />
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
