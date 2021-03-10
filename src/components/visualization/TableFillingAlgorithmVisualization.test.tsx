import { mount, shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import { preGeneratedDatasets } from "../../algorithm/data/datasets";
import { exampleDfa1, exampleDfa2 } from "../../algorithm/data/exampleData";
import {
    TableFillingAlgorithmImpl,
    TableFillingAlgorithmState,
} from "../../algorithm/TableFillingAlgorithm";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";

it("renders cells for each pair in table", function () {
    const algorithm = new TableFillingAlgorithmImpl(exampleDfa1, exampleDfa2);
    const wrapper = shallow(<TableFillingAlgorithmVisualization algorithm={algorithm} />);
    expect(wrapper.find(".table-cell").exists()).toBe(false); // no pairs yet
    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.EMPTY_TABLE);
    expect(algorithm.pairs.entries().length).toBe(28);
    wrapper.setProps({});
    const headerCount = (exampleDfa1.states.length + exampleDfa2.states.length - 1) * 2 + 1;
    expect(wrapper.find(".table-row").length).toBe(
        exampleDfa1.states.length + exampleDfa2.states.length - 1 + 1
    );
    expect(wrapper.find(".table-header").length).toBe(headerCount);
    expect(wrapper.find(".table-cell").length).toBe(28 + headerCount);
});

it("marks pairs correctly, displays witness", function () {
    const algorithm = new TableFillingAlgorithmImpl(exampleDfa1, exampleDfa2, true);
    const wrapper = shallow(<TableFillingAlgorithmVisualization algorithm={algorithm} />);
    algorithm.run();
    wrapper.setProps({});
    const rows = wrapper.find(".table-row");
    let distinguishedCount = 0;
    let notDistinguishedCount = 0;
    for (let i = 1; i < rows.length; i++) {
        const cells = rows.at(i).find(".table-cell");
        for (let j = 1; j < cells.length; j++) {
            const cell = cells.at(j);
            if (cell.text() !== "[]") {
                distinguishedCount++;
            } else {
                notDistinguishedCount++;
            }
        }
    }
    expect(distinguishedCount).toBe(27);
    expect(notDistinguishedCount).toBe(1);
    expect(wrapper.text()).toContain("Witness: 011");
});

it("renders state minimization table correctly", function () {
    const algorithm = new TableFillingAlgorithmImpl(exampleDfa1);
    const wrapper = shallow(<TableFillingAlgorithmVisualization algorithm={algorithm} />);
    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.EMPTY_TABLE);
    expect(algorithm.pairs.entries().length).toBe(6);
    wrapper.setProps({});
    const headerCount = (exampleDfa1.states.length - 1) * 2 + 1;
    expect(wrapper.find(".table-row").length).toBe(exampleDfa1.states.length - 1 + 1);
    expect(wrapper.find(".table-header").length).toBe(headerCount);
    expect(wrapper.find(".table-cell").length).toBe(6 + headerCount);
    algorithm.run();
    wrapper.setProps({});
    expect(wrapper.text()).toContain("All states are distinguishable");
});

it("creates download link for minimized DFA", async function () {
    const algorithm = new TableFillingAlgorithmImpl(preGeneratedDatasets.sprawling[0]);
    algorithm.run();
    const wrapper = mount(<TableFillingAlgorithmVisualization algorithm={algorithm} />);
    await act(async () => {
        // for async DfaVisualization rendering
        await new Promise((resolve) => setImmediate(resolve));
    });
    const downloadButton = wrapper.find("button").at(0);
    expect(downloadButton.text()).toContain("Download minimized");
    const resultDescription = wrapper.find("p");
    expect(resultDescription.text()).toContain("Final state");
    expect(resultDescription.text()).toContain("can be combined");
});
