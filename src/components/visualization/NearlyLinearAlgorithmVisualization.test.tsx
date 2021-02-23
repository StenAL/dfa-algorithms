import { shallow } from "enzyme";
import { dfaA, dfaB } from "../../algorithm/data/exampleData";
import { NearlyLinearAlgorithmImpl } from "../../algorithm/NearlyLinearAlgorithm";
import NearlyLinearAlgorithmVisualization from "./NearlyLinearAlgorithmVisualization";

it("renders sets with representatives and stack", function () {
    const algorithm = new NearlyLinearAlgorithmImpl(dfaA, dfaB);
    const wrapper = shallow(<NearlyLinearAlgorithmVisualization algorithm={algorithm} />);
    algorithm.step();
    algorithm.step();
    algorithm.step();
    wrapper.setProps({});
    const setsTable = wrapper.find(".nearly-linear-sets");
    expect(setsTable.find(".table-row").length).toBe(algorithm.sets.dimension + 1);
    const firstRow = wrapper.find(".table-row").at(1);
    expect(firstRow.find(".visualization-header").text()).toBe("q0");
    expect(firstRow.find(".visualization-cell").text()).toBe("{q0, q4}");

    const processingStack = wrapper.find(".nearly-linear-stack");
    expect(processingStack.find("div div").length).toBe(algorithm.processingStack.size);
    expect(processingStack.find("div div").at(0).text()).toBe(
        "(" + algorithm.processingStack.peek()!.map((s) => s.name) + ")"
    );
});
