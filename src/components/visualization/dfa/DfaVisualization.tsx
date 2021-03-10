import md5 from "md5";
import React, { useEffect, useState } from "react";
import Viz from "viz.js";
import { Module, render } from "viz.js/lite.render";

interface DfaVisualizationProps {
    initialState: string;
    dfaString: string;
    className: "single-visualization" | "double-visualization";
}

export default function DfaVisualization({
    dfaString,
    initialState,
    className,
}: DfaVisualizationProps) {
    const [viz] = useState(new Viz({ render, Module }));
    const [visualization, setVisualization] = useState("");
    const inputHash = "a" + md5(dfaString);

    useEffect(() => {
        async function renderGraph() {
            let svgGraph = await viz.renderString(dfaString, { format: "svg" });
            svgGraph = svgGraph
                .replace(/fill="#ffffff"/g, 'fill="transparent"')
                .replace(/finite_state_machine/g, "");
            setVisualization(svgGraph);
        }

        function colorStartingState() {
            const element = Array.from(
                document.querySelector(`#${inputHash}`)!.querySelectorAll("title")
            ).filter((title) => title.textContent === initialState)[0].parentNode!;
            element.querySelector("ellipse")!.classList.add("starting-state");
        }

        if (dfaString === "") return;
        renderGraph()
            .then(colorStartingState)
            .catch((e) => e);
    }, [dfaString, initialState, viz, inputHash]);

    return (
        <div
            id={inputHash}
            className={`dfa-visualization ${className}`}
            dangerouslySetInnerHTML={{ __html: visualization }}
        />
    );
}
