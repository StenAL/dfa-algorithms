import HashMap from "hashmap";
import Queue from "mnemonist/queue";
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
    CONSTRUCTING_WITNESS,
}

export interface NearlyLinearAlgorithm extends Algorithm {
    type: "nearlyLinear" | "nearlyLinearWitness";
    state: NearlyLinearAlgorithmState | CommonAlgorithmState;
    input2: DFA;
    mode: AlgorithmMode.EQUIVALENCE_TESTING;
    result: EquivalenceTestingResult;

    sets: UnionFind;
    indexToState: Map<number, State>;
    processingStack: Stack<[State, State]>;
    processingQueue: Queue<[State, State]>;
    witnessMap: HashMap<[State, State], [State, State, string]>;
}

export class NearlyLinearAlgorithmImpl implements NearlyLinearAlgorithm {
    type: "nearlyLinear" | "nearlyLinearWitness";
    state: NearlyLinearAlgorithmState | CommonAlgorithmState;
    mode: AlgorithmMode.EQUIVALENCE_TESTING;
    result: EquivalenceTestingResult;

    witness: string;
    produceWitness: boolean;
    input1: DFA;
    input2: DFA;
    log?: Log;

    acceptingStates: Set<State>;
    stateToIndex: Map<State, number>;
    indexToState: Map<number, State>;
    sets: UnionFind;
    processingStack: Stack<[State, State]>;
    processingQueue: Queue<[State, State]>;
    witnessMap: HashMap<[State, State], [State, State, string]>;
    witnessStartingStates: [State, State] | undefined;

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

        this.acceptingStates = new Set<State>();
        this.stateToIndex = new Map<State, number>();
        this.indexToState = new Map<number, State>();
        this.sets = new UnionFind(0);
        this.processingStack = new Stack<[State, State]>();
        this.processingQueue = new Queue<[State, State]>();
        this.witnessMap = new HashMap<[State, State], [State, State, string]>();
    }

    reset(): void {
        this.state = CommonAlgorithmState.INITIAL;
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.witness = "";
        this.log?.clear();

        this.acceptingStates = new Set<State>();
        this.stateToIndex = new Map<State, number>();
        this.indexToState = new Map<number, State>();
        this.sets = new UnionFind(0);
        this.processingStack = new Stack<[State, State]>();
        this.processingQueue = new Queue<[State, State]>();
        this.witnessMap = new HashMap<[State, State], [State, State, string]>();
        this.witnessStartingStates = undefined;
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
                this.initializeProcessing();
                break;
            case NearlyLinearAlgorithmState.COMBINING_SETS:
                this.combineSets();
                break;
            case NearlyLinearAlgorithmState.ALL_SETS_COMBINED:
                this.searchForContradictionInSets();
                break;
            case NearlyLinearAlgorithmState.CONSTRUCTING_WITNESS:
                this.constructWitness();
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    initializeSets() {
        const allStates = this.input1.states.concat(this.input2.states);
        this.acceptingStates = new Set([...this.input1.finalStates, ...this.input2.finalStates]);

        for (let i = 0; i < allStates.length; i++) {
            this.stateToIndex.set(allStates[i], i);
            this.indexToState.set(i, allStates[i]);
        }

        this.sets = new UnionFind(allStates.length);
        this.log?.log(`Initialized ${allStates.length} sets, one for each state in the input DFAs`);
        this.state = NearlyLinearAlgorithmState.SETS_INITIALIZED;
    }

    initializeProcessing() {
        const p0 = this.input1.startingState;
        const q0 = this.input2.startingState;
        this.sets.union(this.stateToIndex.get(p0)!, this.stateToIndex.get(q0)!);
        this.log?.log(`Combined starting states ${p0.name} and ${q0.name} into a single set`);
        if (this.produceWitness) {
            if (this.acceptingStates.has(p0) !== this.acceptingStates.has(q0)) {
                const accepting = this.acceptingStates.has(p0) ? p0 : q0;
                const nonAccepting = accepting === p0 ? q0 : p0;
                this.log?.log(
                    `The DFA are non-equivalent. ${accepting.name} is an accepting state while ${nonAccepting.name} is not`
                );
                this.log?.log(`Witness: "" (empty string)`);
                this.result = EquivalenceTestingResult.NON_EQUIVALENT;
                this.state = CommonAlgorithmState.FINAL;
                return;
            }

            this.processingQueue.enqueue([p0, q0]);
            this.log?.log(
                `Initialized processing queue with the pair of starting states: [(${p0.name},${q0.name})]`
            );
        } else {
            this.processingStack.push([p0, q0]);
            this.log?.log(
                `Initialized processing stack with the pair of starting states: [(${p0.name},${q0.name})]`
            );
        }
        this.state = NearlyLinearAlgorithmState.COMBINING_SETS;
    }

    combineSets() {
        let p: State;
        let q: State;
        if (this.produceWitness) {
            [p, q] = this.processingQueue.dequeue()!;
            this.log?.log(`Dequeued pair (${p.name},${q.name}) from the processing queue`);
        } else {
            [p, q] = this.processingStack.pop()!;
            this.log?.log(`Popped pair (${p.name},${q.name}) off the stack`);
        }

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
                if (this.produceWitness) {
                    this.witnessMap.set([pTo, qTo], [p, q, symbol]);
                    this.log?.log(
                        `Adding entry (${pTo.name}, ${qTo.name}): (${p.name}, ${q.name}, ${symbol}) to the witness map`
                    );
                    if (this.acceptingStates.has(pTo) !== this.acceptingStates.has(qTo)) {
                        const accepting = this.acceptingStates.has(pTo) ? pTo : qTo;
                        const nonAccepting = accepting === pTo ? qTo : pTo;
                        this.log?.log(
                            `${accepting.name} is an accepting state while ${nonAccepting.name} is not. Since they are in the same set, a contradiction has occurred. The DFAs must be non-equivalent.`
                        );
                        this.witnessStartingStates = [pTo, qTo];
                        this.result = EquivalenceTestingResult.NON_EQUIVALENT;
                        this.state = NearlyLinearAlgorithmState.CONSTRUCTING_WITNESS;
                        return;
                    }
                }

                if (this.produceWitness) {
                    this.processingQueue.enqueue([pTo, qTo]);
                    this.log?.log(`Adding pair (${pTo.name},${qTo.name}) to the processing queue.`);
                } else {
                    this.processingStack.push([pTo, qTo]);
                    this.log?.log(
                        `Pushing pair (${pTo.name},${qTo.name}) on the processing stack.`
                    );
                }
            } else {
                this.log?.log(
                    `${pTo.name} and ${qTo.name} are already in the same set (represented by ${
                        this.indexToState.get(this.sets.find(pToIndex))!.name
                    }).`
                );
            }
        }
        if (this.produceWitness) {
            this.log?.log(
                `The queue is now [${Array.from(this.processingQueue).map(
                    ([p, q]) => `(${p.name},${q.name})`
                )}]`
            );
        } else {
            this.log?.log(
                `The stack is now [${Array.from(this.processingStack).map(
                    ([p, q]) => `(${p.name},${q.name})`
                )}]`
            );
        }
        this.log?.log(
            `The sets are now ${this.sets
                .compile()
                .map(
                    (set) => "{" + set.map((el) => this.indexToState.get(el)!.name).join(", ") + "}"
                )
                .join(", ")}`
        );

        if (
            (!this.produceWitness && this.processingStack.size === 0) ||
            (this.produceWitness && this.processingQueue.size === 0)
        ) {
            this.log?.log(
                `The ${
                    this.produceWitness ? "queue" : "stack"
                } is empty, therefore all eligible sets have been combined`
            );
            this.state = NearlyLinearAlgorithmState.ALL_SETS_COMBINED;
            return;
        }
    }

    searchForContradictionInSets() {
        this.log?.log(
            "Scanning sets for contradictions (sets containing both accepting and non-accepting states)"
        );

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
                if (this.acceptingStates.has(state)) {
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

    constructWitness() {
        let [p, q] = this.witnessStartingStates!;
        this.log?.log(
            `Starting witness construction from states that caused the contradiction, p = ${p.name}, q = ${q.name}`
        );
        while (p !== this.input1.startingState && q !== this.input2.startingState) {
            const [q1, q2, symbol] = this.witnessMap.get([p, q])!;
            this.log?.log(
                `Looking up (${p.name},${q.name}) in the witness table, got (${q1.name},${q2.name},${symbol})`
            );
            this.witness = symbol + this.witness;
            this.log?.log(`Prepending ${symbol} to the witness, it is now ${this.witness}`);
            p = q1;
            q = q2;
            this.log?.log(`Setting p = ${q1.name} and q = ${q2.name}`);
        }
        this.log?.log(
            `${p.name} and ${q.name} are the starting states of the DFAs, therefore witness construction is complete.`
        );
        this.log?.log(`Witness: ${this.witness}`);
        this.state = CommonAlgorithmState.FINAL;
    }
}
