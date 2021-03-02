import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import X from "./components/visualization/dfa/X";
// import MainPage from "./components/MainPage";
import VisualizationInput from "./VisualizationInput";

ReactDOM.render(
    <React.StrictMode>
        {/*<MainPage />*/}
        <X />
    </React.StrictMode>,
    document.getElementById("root")
);
