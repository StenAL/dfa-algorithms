export default function Help() {
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
                <a href={process.env.PUBLIC_URL + "/report.pdf"}>here</a>.
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
            <p>Coming soon</p>
            <h4>Random</h4>
            <p>Coming soon</p>
            <h4>Linear</h4>
            <p>Coming soon</p>
            <h4>Sprawling</h4>
            <p>Coming soon</p>
        </div>
    );
}
