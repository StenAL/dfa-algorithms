import Stack from "mnemonist/stack";
import UnionFind from "mnemonist/static-disjoint-set";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
    Log,
} from "../types/Algorithm";
import { DFA, State } from "../types/DFA";

export enum NearlyLinearAlgorithmState {
    SETS_INITIALIZED,
    COMBINING_SETS,
    ALL_SETS_COMBINED,
}

export interface NearlyLinearAlgorithm extends Algorithm {
    type: "nearlyLinear" | "nearlyLinearWitness";
    state: NearlyLinearAlgorithmState | CommonAlgorithmState;
    input2: DFA;
    mode: AlgorithmMode.EQUIVALENCE_TESTING;

    sets: UnionFind;
    processingStack: Stack<[State, State]>;
    indexToState: Map<number, State>;
}

export class NearlyLinearAlgorithmImpl implements NearlyLinearAlgorithm {
    type: "nearlyLinear" | "nearlyLinearWitness";
    state: NearlyLinearAlgorithmState | CommonAlgorithmState;
    mode: AlgorithmMode.EQUIVALENCE_TESTING;
    result: EquivalenceTestingResult | DFA;

    witness: string;
    produceWitness: boolean;
    input1: DFA;
    input2: DFA;
    log?: Log;

    stateToIndex: Map<State, number>;
    indexToState: Map<number, State>;
    sets: UnionFind;
    processingStack: Stack<[State, State]>;

    constructor(input1: DFA, input2: DFA, produceWitness?: boolean) {
        this.type = produceWitness ? "nearlyLinearWitness" : "nearlyLinear";
        this.state = CommonAlgorithmState.INITIAL;
        this.mode = AlgorithmMode.EQUIVALENCE_TESTING;

        this.input1 = input1;
        this.input2 = input2;
        this.log = undefined;
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.produceWitness = produceWitness ?? false;
        this.witness = "";

        this.stateToIndex = new Map<State, number>();
        this.indexToState = new Map<number, State>();
        this.sets = new UnionFind(0);
        this.processingStack = new Stack<[State, State]>();
    }

    reset(): void {
        this.state = CommonAlgorithmState.INITIAL;
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.witness = "";
        this.log?.clear();

        this.stateToIndex = new Map<State, number>();
        this.indexToState = new Map<number, State>();
        this.sets = new UnionFind(0);
        this.processingStack = new Stack<[State, State]>();
    }

    run() {
        while (this.state !== CommonAlgorithmState.FINAL) {
            this.step();
        }
    }

    step(): void {
        switch (this.state) {
            case CommonAlgorithmState.INITIAL:
                this.initializeSets();
                break;
            case NearlyLinearAlgorithmState.SETS_INITIALIZED:
                this.initializeStack();
                break;
            case NearlyLinearAlgorithmState.COMBINING_SETS:
                this.combineSets();
                break;
            case NearlyLinearAlgorithmState.ALL_SETS_COMBINED:
                this.searchForContradictionInSets();
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    initializeSets() {
        const allStates = this.input1.states.concat(this.input2.states);

        for (let i = 0; i < allStates.length; i++) {
            this.stateToIndex.set(allStates[i], i);
            this.indexToState.set(i, allStates[i]);
        }

        this.sets = new UnionFind(allStates.length);
        this.log?.log(`Initialized ${allStates.length} sets, one for each state in the input DFAs`);
        this.state = NearlyLinearAlgorithmState.SETS_INITIALIZED;
    }

    initializeStack() {
        const p0 = this.input1.startingState;
        const q0 = this.input2.startingState;
        this.sets.union(this.stateToIndex.get(p0)!, this.stateToIndex.get(q0)!);
        this.processingStack.push([p0, q0]);
        this.log?.log(`Combined starting states ${p0.name} and ${q0.name} into a single set`);
        this.log?.log(
            `Initialized processing stack with the pair of starting states: [(${p0.name},${q0.name})]`
        );
        this.state = NearlyLinearAlgorithmState.COMBINING_SETS;
    }

    combineSets() {
        const [p, q] = this.processingStack.pop()!;
        this.log?.log(`Popped pair (${p.name},${q.name}) off the stack`);
        for (let symbol of this.input1.alphabet) {
            const pTo = p.transitions.get(symbol)!;
            const qTo = q.transitions.get(symbol)!;

            const pToIndex = this.stateToIndex.get(pTo)!;
            const qToIndex = this.stateToIndex.get(qTo)!;

            this.log?.log(
                `On input ${symbol}, ${p.name} transitions to ${pTo.name} and ${q.name} transitions to ${qTo.name}`
            );
            if (!this.sets.connected(pToIndex, qToIndex)) {
                this.log?.log(
                    `${pTo.name} is in a set represented by ${
                        this.indexToState.get(this.sets.find(pToIndex))!.name
                    } while ${qTo.name} is represented by ${
                        this.indexToState.get(this.sets.find(qToIndex))!.name
                    }. These representatives are different, therefore their sets are combined.`
                );
                this.sets.union(pToIndex, qToIndex);
                this.processingStack.push([pTo, qTo]);
                this.log?.log(`Pushing pair (${pTo.name},${qTo.name}) on the processing stack.`);
            } else {
                this.log?.log(`${pTo.name} and ${qTo.name} are already in the same set.`);
            }
        }
        this.log?.log(
            `The stack is now [${Array.from(this.processingStack).map(
                ([p, q]) => `(${p.name},${q.name})`
            )}]`
        );
        this.log?.log(
            `The sets are now ${this.sets
                .compile()
                .map(
                    (set) => "{" + set.map((el) => this.indexToState.get(el)!.name).join(", ") + "}"
                )
                .join(", ")}`
        );

        if (this.processingStack.size === 0) {
            this.log?.log("The stack is empty, therefore all eligible sets have been combined");
            this.state = NearlyLinearAlgorithmState.ALL_SETS_COMBINED;
            return;
        }
    }

    searchForContradictionInSets() {
        this.log?.log(
            "Scanning sets for sets containing contradictions (both accepting and non-accepting states)"
        );
        const acceptingStates = new Set([...this.input1.finalStates, ...this.input2.finalStates]);

        const finalSets = this.sets.compile();
        for (let finalSet of finalSets) {
            this.log?.log(
                `Scanning set {${finalSet
                    .map((index) => this.indexToState.get(index)!)
                    .map((s) => s.name)
                    .join(", ")}}`
            );
            let acceptingState = undefined;
            let nonAcceptingState = undefined;
            for (let index of finalSet) {
                const state = this.indexToState.get(index)!;
                if (acceptingStates.has(state)) {
                    acceptingState = state;
                } else {
                    nonAcceptingState = state;
                }
            }
            if (acceptingState !== undefined && nonAcceptingState !== undefined) {
                this.log?.log(
                    `Set contains accepting state ${acceptingState.name} and non-accepting state ${nonAcceptingState.name}. DFAs are non-equivalent.`
                );
                this.result = EquivalenceTestingResult.NON_EQUIVALENT;
                this.state = CommonAlgorithmState.FINAL;
                return;
            }
            this.log?.log(
                `All states in set are ${acceptingState ? "accepting" : "non-accepting"}, moving on`
            );
        }

        this.log?.log("No sets contain any contradictions. DFAs are equivalent");
        this.result = EquivalenceTestingResult.EQUIVALENT;
        this.state = CommonAlgorithmState.FINAL;
    }
}
