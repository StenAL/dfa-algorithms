import {
    deBruijnDatasetGenerator,
    linearDatasetGenerator,
    randomDatasetGenerator,
    sprawlingDatasetGenerator,
} from "../algorithm/data/datasetGenerator";
import { exampleDfa1 } from "../algorithm/data/exampleData";
import { dfaToNoamInput } from "../util/util";
import DfaVisualization from "./visualization/dfa/DfaVisualization";

export default function Help() {
    const randomDfaExample = randomDatasetGenerator(5, ["0", "1"], 1);
    const sprawlingDfaExample = sprawlingDatasetGenerator(7, ["0", "1"], 1);
    const linearDfaExample = linearDatasetGenerator(5, ["0", "1"], 1);
    const deBruijnDfaExample = deBruijnDatasetGenerator(4, ["0", "1"], 2);
    return (
        <div className={"page-container help"}>
            <h2>Help</h2>
            <h3>About</h3>
            <p>
                This page contains the implementation side of my 6CCS3PRJ Final Year Project at
                King's College London entitled&nbsp;
                <code>
                    Finite State Machine Educational Tools: Implementing Equivalence Testing and
                    State Minimization Algorithms
                </code>
            </p>
            <p>
                The project aims to implement three DFA state minimization and equivalence testing
                algorithms and visualize their working process to users in an educational fashion.
            </p>
            <p>
                Additionally, it provides functionality to generate DFAs that can be used to run and
                contrast the algorithms. These DFAs are generated from templates that are designed
                to induce worst-case behaviour in the algorithms.
            </p>
            <p>
                The report accompanying the software can be found&nbsp;
                <a href={process.env.PUBLIC_URL + "/report.pdf"}>here</a>. The report contains
                in-depth information about the background and implementation of this project,
                including concrete examples describing and running the algorithms.
            </p>
            <h3>Glossary</h3>
            <p>
                <b>Indistinguishable states</b> of DFAs are groups of states where computations on
                every input terminate the same way. If a computation from a state on some input ends
                in an accepting state, then all states that are indistinguishable with the state
                must also eventually transition to an accepting state on the same input.
                Analogously, if the state terminates in a non-accepting state on an input, all
                indistinguishable states must also terminate in a non-accepting state on that input.
            </p>
            <p>
                <b>Equivalent DFAs</b> are DFAs that have indistinguishable starting states. The
                process of determining whether DFAs are equivalent is <b>equivalence testing</b>.
            </p>
            <p>
                <b>State minimization</b> is the process of creating a new DFA from some DFA where
                all groups of indistinguishable states are combined into single states.
            </p>
            <h3>Manual</h3>
            <h4>Input</h4>
            <p>
                Whether visualizing an algorithm or running one in headless mode, input is needed.
                One way to do this is to use pre-generated datasets available in buttons above
                custom input fields. In this case the input fields are filled in automatically and
                the results are visualized. These fields can then be modified to customize the DFAs.
                Alternatively, custom DFAs can be input by filling in the alphabet, states, final
                states, and transitions fields. The alphabet, states, and final states fields expect
                a list comma-separated values. The transition fields are dynamically generated from
                the alphabet and state values and are shown as a table. Validation is performed on
                the fields to ensure the input is correct.
            </p>
            <p>
                Custom inputs can be saved to a local JSON file using the "Save to File" button.
                They can later be loaded using the "Select file..." button to fill in the DFA input
                fields.
            </p>
            <h4>Headless mode</h4>
            <p>
                Headless mode can be used to run algorithms without visualizing them. Simply select
                the algorithms you wish to run, input some data (or use pre-generated inputs), and
                click "Run". This transitions you to the headless mode runner screen, where all
                selected algorithms are run sequentially and their results and running times are
                shown in a report.
            </p>
            <h4>Dataset generation</h4>
            <p>
                To avoid manually inputting DFAs, dataset generators can be used. These generators
                take an alphabet, a number of states, and a number of final states as parameters and
                generate a DFA from a pre-defined template. These templates are described below in
                the Datasets section. Datasets can be saved to a JSON file using the "Download"
                button.
            </p>
            <h3>Algorithms</h3>
            <h4>The Table-Filling Algorithm</h4>
            <p>
                Also known as Moore's Algorithm, the Table-Filling Algorithm does state minimization
                and equivalence testing by distinguishing individual states of DFAs. It does this by
                storing a table of pairs and marking pairs based on their successors. The
                Table-Filling Algorithm has a worst-case time complexity of&nbsp;
                <code>O(n^4)</code>.
            </p>
            <p>
                In the visualization of the Table-Filling Algorithm, users are shown the table and
                it is progressively filled in step-by-step.
            </p>
            <h4>The n-lg-n Hopcroft Algorithm</h4>
            <p>
                The n-lg-n Hopcroft Algorithm works by distinguishing DFA states but instead of
                looking at every single pair it tries to create blocks of states that are
                indistinguishable. For that, it utilizes the inverse-transition function of the
                DFAs, seeing which states lead to different partitions. The n-lg-n Hopcroft
                Algorithm (unsurprisingly) has a worst-case time complexity of&nbsp;
                <code>O(n lg n)</code>.
            </p>
            <p>
                In the visualization of the n lg n Hopcroft Algorithm, users are shown the partition
                blocks and various helper data-structures used by the algorithm to create these
                partitions.
            </p>
            <h4>The (Nearly) Linear Algorithm</h4>
            <p>
                The (Nearly) Linear Algorithm does not support state minimization, it can only be
                used for equivalence testing. It works assuming the starting states of two DFAs are
                indistinguishable and therefore their successors must also be indistinguishable.
                Recursively applying this logic, it reaches a point where all states that are must
                be indistinguishable if the DFAs are equivalent are grouped into a single set. It
                then scans the sets to identify if any contradictions have arisen and the initial
                assumption is false. The (Nearly) Linear Algorithm has a worst-case time complexity
                of&nbsp;
                <code>O(a(n))</code>, where a is the inverse Ackermann function.
            </p>
            <h3>Datasets</h3>
            <p>
                Datasets are concrete DFAs created from templates and can be used to run and compare
                algorithms. This project defines four different templates, which can be accessed
                from the dataset generation page.
            </p>
            <DfaVisualization
                initialState={exampleDfa1.startingState.name}
                dfaString={dfaToNoamInput(exampleDfa1)}
                className={"single-visualization"}
            />
            <h4>Random</h4>
            <p>
                Random datasets consist of DFAs where transitions and final states are allocated
                randomly. The DFA might or might not contain cycles, the only thing that is
                guaranteed is that all states in the DFA are connected. Random datasets are useful
                for comparing different algorithms and benchmarking them against each other.
            </p>
            <DfaVisualization
                initialState={randomDfaExample.startingState.name}
                dfaString={dfaToNoamInput(randomDfaExample)}
                className={"single-visualization"}
            />
            <h4>Linear</h4>
            <p>
                Linear datasets are DFAs in which the transition graph forms a straight line. Each
                state only has transitions going to it from the previous state and will only
                transition to the next state. These DFAs induce worst-case performance in The
                Table-Filling Algorithm.
            </p>
            <DfaVisualization
                initialState={linearDfaExample.startingState.name}
                dfaString={dfaToNoamInput(linearDfaExample)}
                className={"single-visualization"}
            />
            <h4>Sprawling</h4>
            <p>
                Sprawling datasets create transitions that form full trees. They are as broad as
                possible and induce worst-case performance in The (Nearly) Linear Algorithm."
            </p>
            <DfaVisualization
                initialState={sprawlingDfaExample.startingState.name}
                dfaString={dfaToNoamInput(sprawlingDfaExample)}
                className={"single-visualization"}
            />
            <h4>De Bruijn</h4>
            <p>
                De Bruijn datasets are DFAs generated from binary de Bruijn words. A binary de
                Bruijn word is a string of ones and zeroes of length 2^n where all binary words of
                length n are present exactly once in a cycle formed by the word. In a de Bruinj DFA,
                transitions are assigned to form a cycle and final states are those which correspond
                to a 1 in a binary de Bruijn word that has at least as many characters as the DFA
                has states. De Bruijn datasets induce worst-case performance in the n lg n Hopcroft
                Algorithm if they are generated with 2^n states and half of the states are final
                states.
            </p>
            <DfaVisualization
                initialState={deBruijnDfaExample.startingState.name}
                dfaString={dfaToNoamInput(deBruijnDfaExample)}
                className={"single-visualization"}
            />
        </div>
    );
}
