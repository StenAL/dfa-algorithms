import md5 from "md5";
import React, { useEffect, useState } from "react";
import Viz from "viz.js";
import { Module, render } from "viz.js/lite.render";

interface DfaVisualizationProps {
    initialState: string;
    dfaString: string;
}

export default function DfaVisualization({ dfaString, initialState }: DfaVisualizationProps) {
    const [viz] = useState(new Viz({ render, Module }));
    const [visualization, setVisualization] = useState("");
    const inputHash = "a" + md5(dfaString);

    async function renderGraph() {
        const svgGraph = await viz.renderString(dfaString, { format: "svg" });
        setVisualization(svgGraph);
    }

    function colorStartingState() {
        const element = Array.from(
            document.querySelector(`#${inputHash}`)!.querySelectorAll("title")
        ).filter((title) => title.textContent === initialState)[0].parentNode!;
        element.querySelector("ellipse")!.classList.add("currentState");
    }

    useEffect(() => {
        if (dfaString === "") return;
        renderGraph().then(colorStartingState).catch(console.log);
    }, [dfaString]);

    return <div id={inputHash} dangerouslySetInnerHTML={{ __html: visualization }} />;
}
