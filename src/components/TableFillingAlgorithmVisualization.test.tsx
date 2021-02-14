import { shallow } from "enzyme";
import { dfaA, dfaB } from "../algorithm/data";
import TableFillingAlgorithm, {
    TableFillingAlgorithmState,
} from "../algorithm/TableFillingAlgorithm";
import { CommonAlgorithmState } from "../types/Algorithm";
import TableFillingAlgorithmVisualization from "./TableFillingAlgorithmVisualization";

it("renders cells for each pair in table", function () {
    const algorithm = new TableFillingAlgorithm(dfaA, dfaB);
    const wrapper = shallow(
        <TableFillingAlgorithmVisualization algorithm={algorithm} />
    );
    expect(wrapper.find(".table-filling-cell").exists()).toBe(false); // no pairs yet
    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.EMPTY_TABLE);
    expect(algorithm.pairs.entries().length).toBe(28);
    wrapper.setProps({});
    const headerCount = (dfaA.states.length + dfaB.states.length - 1) * 2 + 1;
    expect(wrapper.find(".table-filling-row").length).toBe(
        dfaA.states.length + dfaB.states.length - 1 + 1
    );
    expect(wrapper.find(".table-filling-header").length).toBe(headerCount);
    expect(wrapper.find(".table-filling-cell").length).toBe(28 + headerCount);
});

it("marks pairs correctly, displays witness", function () {
    const algorithm = new TableFillingAlgorithm(dfaA, dfaB, true);
    const wrapper = shallow(
        <TableFillingAlgorithmVisualization algorithm={algorithm} />
    );
    while (algorithm.state !== CommonAlgorithmState.FINAL) {
        algorithm.step();
    }
    wrapper.setProps({});
    const rows = wrapper.find(".table-filling-row");
    let distinguishedCount = 0;
    let notDistinguishedCount = 0;
    for (let i = 1; i < rows.length; i++) {
        const cells = rows.at(i).find(".table-filling-cell");
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
    const algorithm = new TableFillingAlgorithm(dfaA);
    const wrapper = shallow(
        <TableFillingAlgorithmVisualization algorithm={algorithm} />
    );
    algorithm.step();
    expect(algorithm.state).toBe(TableFillingAlgorithmState.EMPTY_TABLE);
    expect(algorithm.pairs.entries().length).toBe(6);
    wrapper.setProps({});
    const headerCount = (dfaA.states.length - 1) * 2 + 1;
    expect(wrapper.find(".table-filling-row").length).toBe(
        dfaA.states.length - 1 + 1
    );
    expect(wrapper.find(".table-filling-header").length).toBe(headerCount);
    expect(wrapper.find(".table-filling-cell").length).toBe(6 + headerCount);
    while (algorithm.state !== CommonAlgorithmState.FINAL) {
        algorithm.step();
    }
    wrapper.setProps({});
    expect(wrapper.text()).toContain("All states are distinguishable");
});
