import React from "react";
import ReactDOM from "react-dom";
import MainPage from "./components/MainPage";

jest.mock("react-dom", () => ({ render: jest.fn() }));

it("renders root without crashing", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    require("./index.tsx");
    expect(ReactDOM.render).toHaveBeenCalledWith(
        <React.StrictMode>
            <MainPage />
        </React.StrictMode>,
        div
    );
});
