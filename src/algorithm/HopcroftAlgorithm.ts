import HashMap from "hashmap";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
    Log,
} from "../types/Algorithm";
import { DFA, State } from "../types/DFA";

export enum HopcroftAlgorithmState {
    INVERSE_TRANSITION_FUNCTION_CREATED,
    INITIAL_PARTITIONS_CREATED,
    SETS_OF_STATES_WITH_PREDECESSORS_CREATED,
    PARTITIONING_BLOCKS,
    ALL_BLOCKS_PARTITIONED,
}

interface HopcroftAlgorithmInterface extends Algorithm {
    input1: DFA;
    input2: DFA;
    result: EquivalenceTestingResult | DFA;
    iteration: number;
    mode: AlgorithmMode;
    inverseTransitionFunction: HashMap<[State, string], Set<State>>;
    state: HopcroftAlgorithmState | CommonAlgorithmState;
    blocks: Map<number, Set<State>>;
    statesWithPredecessors: HashMap<[string, number], Set<State>>; // (block number i, alphabet symbol a) -> set of states in block i that have predecessors on input a
    toDoLists: Map<string, Set<number>>;
    stateToBlockNumber: Map<State, number>;
}

export default class HopcroftAlgorithm implements HopcroftAlgorithmInterface {
    type: "hopcroft" | "hopcroftWitness";

    constructor(input1: DFA, input2: DFA, produceWitness?: boolean) {
        this.type = produceWitness ? "hopcroft" : "hopcroftWitness";
        this.input1 = input1;
        this.input2 = input2 ?? input1;
        this.log = undefined;
        this.state = CommonAlgorithmState.INITIAL;
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.iteration = 1;
        this.mode = input2 ? AlgorithmMode.EQUIVALENCE_TESTING : AlgorithmMode.STATE_MINIMIZATION;
        this.produceWitness = produceWitness ?? false;
        this.witness = "";
        this.inverseTransitionFunction = new HashMap<[State, string], Set<State>>();
        this.blocks = new Map<number, Set<State>>();
        this.statesWithPredecessors = new HashMap<[string, number], Set<State>>();
        this.toDoLists = new Map<string, Set<number>>();
        this.stateToBlockNumber = new Map<State, number>();
        this.k = 3;
    }

    state: HopcroftAlgorithmState | CommonAlgorithmState;

    input1: DFA;
    input2: DFA;
    iteration: number;
    log?: Log;
    mode: AlgorithmMode;
    produceWitness: boolean;
    k: number;

    reset(): void {}

    result: EquivalenceTestingResult | DFA;

    run() {
        while (this.state !== CommonAlgorithmState.FINAL) {
            this.step();
        }
    }

    step(): void {
        switch (this.state) {
            case CommonAlgorithmState.INITIAL:
                this.createInverseTransitionFunction();
                break;
            case HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED:
                this.createInitialPartitions();
                break;
            case HopcroftAlgorithmState.INITIAL_PARTITIONS_CREATED:
                this.initializeStatesWithPredecessorSets();
                break;
            case HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED:
                this.createToDoLists();
                break;
            case HopcroftAlgorithmState.PARTITIONING_BLOCKS:
                this.partitionBlocks();
                break;
            case HopcroftAlgorithmState.ALL_BLOCKS_PARTITIONED:
                this.testStartingStatesAreDistinguishable();
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    createInverseTransitionFunction() {
        let allStates: State[];
        if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
            allStates = this.input1.states.concat(this.input2.states);
        } else {
            allStates = this.input1.states;
        }
        for (let state of allStates) {
            for (let symbol of this.input1.alphabet) {
                this.inverseTransitionFunction.set([state, symbol], new Set<State>());
            }
        }

        for (let state of allStates) {
            for (let symbol of this.input1.alphabet) {
                const transitionTo = state.transitions.get(symbol)!;
                this.inverseTransitionFunction.get([transitionTo, symbol]).add(state);
            }
        }

        // for (let e of this.inverseTransitionFunction.entries()) {
        //     const k = `${e[0][0].name},${e[0][1]}`
        //     const v = Array.from(e[1]).map(el => el.name)
        //     console.log(`${k} -- ${v}`)
        // }
        this.state = HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED;
    }

    createInitialPartitions() {
        let acceptingStates: Set<State> = new Set<State>();
        let nonAcceptingStates: undefined | Set<State>;
        if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
            acceptingStates = new Set([...this.input1.finalStates, ...this.input2.finalStates]);
            nonAcceptingStates = new Set(
                this.input1.states.concat(this.input2.states).filter((s) => !acceptingStates.has(s))
            );
        } else {
            acceptingStates = new Set(this.input1.finalStates);
            nonAcceptingStates = new Set(this.input1.states.filter((s) => !acceptingStates.has(s)));
        }
        acceptingStates.forEach((s) => this.stateToBlockNumber.set(s, 1));
        nonAcceptingStates.forEach((s) => this.stateToBlockNumber.set(s, 2));
        this.blocks.set(1, acceptingStates);
        this.blocks.set(2, nonAcceptingStates);
        this.state = HopcroftAlgorithmState.INITIAL_PARTITIONS_CREATED;
    }

    initializeStatesWithPredecessorSets() {
        this.createStatesWithPredecessorsSets([1, 2]);
        this.state = HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED;
    }

    createStatesWithPredecessorsSets(blockNumbers: number[]) {
        for (let symbol of this.input1.alphabet) {
            for (let i of blockNumbers) {
                const block = this.blocks.get(i)!;
                const statesWithPredecessors = new Set<State>();
                for (let state of block) {
                    if (this.inverseTransitionFunction.get([state, symbol]).size > 0) {
                        statesWithPredecessors.add(state);
                    }
                }
                this.statesWithPredecessors.set([symbol, i], statesWithPredecessors);
            }
        }
        for (let entry of this.statesWithPredecessors.entries()) {
            const k = `symbol(${entry[0][0]}),block(${entry[0][1]})`;
            const v = Array.from(entry[1])
                .map((s) => s.name)
                .join(", ");
            console.log(`{${k} -- ${v}}`);
        }
    }

    createToDoLists() {
        for (let symbol of this.input1.alphabet) {
            const toDoList = new Set<number>();
            this.toDoLists.set(symbol, toDoList);
            if (
                this.statesWithPredecessors.get([symbol, 1]).size <=
                this.statesWithPredecessors.get([symbol, 2]).size
            ) {
                toDoList.add(1);
            } else {
                toDoList.add(2);
            }
        }
        // console.log(this.toDoLists);
        this.state = HopcroftAlgorithmState.PARTITIONING_BLOCKS;
    }

    partitionBlocks() {
        const firstToDoList = Array.from(this.toDoLists.entries()).find(
            ([_, toDoList]) => toDoList.size > 0
        )!;
        const symbol = firstToDoList[0];
        const blockNumber = firstToDoList[1].values().next().value as number;
        this.toDoLists.get(symbol)!.delete(blockNumber);
        console.log(
            `Partitioning predecessors of block number ${blockNumber} on symbol '${symbol}'`
        );

        const block = this.blocks.get(blockNumber)!;
        const predecessors = Array.from(block)
            .map((s) => this.inverseTransitionFunction.get([s, symbol]))
            .reduce((acc, value) => {
                value.forEach((s) => acc.add(s));
                return acc;
            }, new Set());

        if (predecessors.size === 0) {
            console.log("no predecessors");
        }

        const blocksToBeSplit = new Map<number, Set<State>>(); // block number -> states which will be in new block
        for (let predecessor of predecessors) {
            const predecessorBlockNumber = this.stateToBlockNumber.get(predecessor)!;
            if (!blocksToBeSplit.has(predecessorBlockNumber)) {
                blocksToBeSplit.set(predecessorBlockNumber, new Set<State>());
            }
            blocksToBeSplit.get(predecessorBlockNumber)!.add(predecessor);
        }

        for (let newBlockEntry of blocksToBeSplit.entries()) {
            const newBlock = newBlockEntry[1];
            const splitBlockNumber = newBlockEntry[0];
            console.log(`Splitting block ${splitBlockNumber}`);
            const existingBlock = this.blocks.get(splitBlockNumber)!;
            if (newBlock.size < existingBlock.size) {
                const bk = new Set([...existingBlock].filter((x) => !newBlock.has(x)));
                this.blocks.set(this.k, bk);
                this.blocks.set(splitBlockNumber, newBlock);
                bk.forEach((state) => this.stateToBlockNumber.set(state, this.k));

                this.createStatesWithPredecessorsSets([splitBlockNumber, this.k]);
                for (let s of this.input1.alphabet) {
                    if (
                        !this.toDoLists.get(s)!.has(splitBlockNumber) &&
                        this.statesWithPredecessors.get([s, splitBlockNumber]).size > 0 &&
                        this.statesWithPredecessors.get([s, splitBlockNumber]).size <=
                            this.statesWithPredecessors.get([symbol, this.k]).size
                    ) {
                        this.toDoLists.get(s)!.add(splitBlockNumber);
                    } else {
                        this.toDoLists.get(s)!.add(this.k);
                    }
                }
                this.k++;
            }
        }

        if (Array.from(this.toDoLists.values()).every((toDoList) => toDoList.size === 0)) {
            console.log("done");
            this.state = HopcroftAlgorithmState.ALL_BLOCKS_PARTITIONED;
            return;
        }
    }

    testStartingStatesAreDistinguishable() {
        const q1 = this.input1.startingState;
        const q2 = this.input2.startingState;

        const q1Block = this.stateToBlockNumber.get(q1)!;
        const q2Block = this.stateToBlockNumber.get(q2)!;

        if (q1Block === q2Block) {
            this.result = EquivalenceTestingResult.EQUIVALENT;
            this.log?.log(
                `Starting states ${q1.name} and ${q2.name} are indistinguishable, therefore the DFAs are equivalent`
            );
        } else {
            this.result = EquivalenceTestingResult.NON_EQUIVALENT;
            this.log?.log(
                `Starting states ${q1.name} and ${q2.name} are distinguishable, therefore the DFAs are non-equivalent`
            );
        }
        if (!this.produceWitness) {
            this.state = CommonAlgorithmState.FINAL;
        } else {
            // this.state = TableFillingAlgorithmState.CONSTRUCTING_WITNESS;
        }
    }

    witness: string;
    inverseTransitionFunction: HashMap<[State, string], Set<State>>;
    blocks: Map<number, Set<State>>;
    statesWithPredecessors: HashMap<[string, number], Set<State>>;
    toDoLists: Map<string, Set<number>>;
    stateToBlockNumber: Map<State, number>;
}
