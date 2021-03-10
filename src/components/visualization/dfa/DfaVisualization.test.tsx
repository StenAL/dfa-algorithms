import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { exampleDfa1 } from "../../../algorithm/data/exampleData";
import { dfaToNoamInput } from "../../../util/util";
import DfaVisualization from "./DfaVisualization";

it("renders svg", async function () {
    const dfa = exampleDfa1;
    let wrapper = mount(
        <DfaVisualization
            dfaString={dfaToNoamInput(dfa)}
            initialState={dfa.startingState.name}
            className={"single-visualization"}
        />
    );
    await act(async () => {
        // for async useEffect
        await new Promise((resolve) => setImmediate(resolve));
    });

    expect(wrapper.html().includes("<svg")).toBe(true);
});
