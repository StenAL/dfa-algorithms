import { mount } from "enzyme";
import { exampleDfa1, exampleDfa2 } from "../../algorithm/data/exampleData";
import { HopcroftAlgorithmImpl, HopcroftAlgorithmState } from "../../algorithm/HopcroftAlgorithm";
import HopcroftAlgorithmVisualization from "./HopcroftAlgorithmVisualization";

it("visualizes inverse transition function, partitions, states with predecessors, to-do lists correctly", function () {
    const algorithm = new HopcroftAlgorithmImpl(exampleDfa1, exampleDfa2);
    const wrapper = mount(<HopcroftAlgorithmVisualization algorithm={algorithm} />);
    algorithm.step();
    wrapper.setProps({});
    const inverseTransitionTable = wrapper.find(".visualization-table").at(0);
    let firstRow = inverseTransitionTable.find(".table-row").at(1);
    expect(inverseTransitionTable.find(".table-row").length).toBe(
        algorithm.inverseTransitionFunction.count() + 1
    );
    expect(firstRow.find(".visualization-header").at(0).text()).toBe("q1");
    expect(firstRow.find(".visualization-header").at(1).text()).toBe("0");
    expect(firstRow.find(".visualization-cell").at(0).text()).toBe("{q0}");

    algorithm.step();
    wrapper.setProps({});
    const initialPartitions = wrapper.find(".visualization-table");
    firstRow = initialPartitions.find(".table-row").at(1);
    expect(initialPartitions.find(".table-row").length).toBe(algorithm.blocks.size + 1);
    expect(firstRow.find(".visualization-header").at(0).text()).toBe("1");
    expect(firstRow.find(".visualization-cell").at(0).text()).toBe("{q2, q6}");

    algorithm.step();
    wrapper.setProps({});
    const statesWithPredecessors = wrapper.find(".visualization-table").at(1);
    firstRow = statesWithPredecessors.find(".table-row").at(1);
    const nonEmptyStatesWithPredecessorsCount = Array.from(
        algorithm.statesWithPredecessors.values()
    ).filter((s) => s.size > 0).length;
    expect(statesWithPredecessors.find(".table-row").length).toBe(
        nonEmptyStatesWithPredecessorsCount + 1
    );
    expect(firstRow.find(".visualization-header").at(0).text()).toBe("2");
    expect(firstRow.find(".visualization-header").at(1).text()).toBe("0");
    expect(firstRow.find(".visualization-cell").at(0).text()).toBe("{q1, q3, q5, q7}");

    algorithm.step();
    wrapper.setProps({});
    const toDoLists = wrapper.find(".visualization-table").at(2);
    firstRow = toDoLists.find(".table-row").at(1);
    expect(toDoLists.find(".table-row").length).toBe(algorithm.toDoLists.size + 1);
    expect(firstRow.find(".visualization-header").at(0).text()).toBe("0");
    expect(firstRow.find(".visualization-cell").at(0).text()).toBe("{1}");

    algorithm.run();
    wrapper.setProps({});
    const partitions = wrapper.find(".visualization-table");
    firstRow = partitions.find(".table-row").at(1);
    expect(partitions.find(".table-row").length).toBe(algorithm.blocks.size + 1);
    expect(firstRow.find(".visualization-header").at(0).text()).toBe("1");
    expect(firstRow.find(".visualization-cell").at(0).text()).toBe("{q2}");
});

it("renders witness table correctly", function () {
    const algorithm = new HopcroftAlgorithmImpl(exampleDfa1, exampleDfa2, true);
    const wrapper = mount(<HopcroftAlgorithmVisualization algorithm={algorithm} />);
    while (algorithm.state !== HopcroftAlgorithmState.CONSTRUCTING_WITNESS) {
        algorithm.step();
    }
    wrapper.setProps({});

    const witnessTable = wrapper.find(".visualization-table");
    const firstRow = witnessTable.find(".table-row").at(1);
    expect(witnessTable.find(".table-row").length).toBe(algorithm.input2.states.length + 1);
    expect(firstRow.find(".table-cell").length).toBe(algorithm.input1.states.length + 1);
    expect(firstRow.find(".table-header").at(0).text()).toBe("q4");
    expect(firstRow.find(".table-cell").at(1).text()).toBe("0");
    expect(firstRow.find(".table-cell").at(2).text()).toBe("1");
    expect(firstRow.find(".table-cell").at(3).text()).toBe("");
    expect(firstRow.find(".table-cell").at(4).text()).toBe("0");
});
