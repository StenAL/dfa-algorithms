import HashMap from "hashmap";
import {
    Algorithm,
    AlgorithmMode,
    CommonAlgorithmState,
    EquivalenceTestingResult,
    Log,
} from "../types/Algorithm";
import { DFA, State } from "../types/DFA";
import minimizer from "./Minimizer";

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

    constructor(input1: DFA, input2?: DFA, produceWitness?: boolean) {
        this.type = produceWitness ? "hopcroftWitness" : "hopcroft";
        this.input1 = input1;
        this.input2 = input2 ?? input1;
        this.log = undefined;
        this.state = CommonAlgorithmState.INITIAL;
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
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
    log?: Log;
    mode: AlgorithmMode;
    produceWitness: boolean;
    k: number;

    reset(): void {
        this.state = CommonAlgorithmState.INITIAL;
        this.result = EquivalenceTestingResult.NOT_AVAILABLE;
        this.witness = "";
        this.inverseTransitionFunction = new HashMap<[State, string], Set<State>>();
        this.blocks = new Map<number, Set<State>>();
        this.statesWithPredecessors = new HashMap<[string, number], Set<State>>();
        this.toDoLists = new Map<string, Set<number>>();
        this.stateToBlockNumber = new Map<State, number>();
        this.k = 3;
        this.log?.clear();
    }

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
                if (this.mode === AlgorithmMode.EQUIVALENCE_TESTING) {
                    this.testStartingStatesAreDistinguishable();
                } else if (this.mode === AlgorithmMode.STATE_MINIMIZATION) {
                    this.combineIndistinguishableGroups();
                }
                break;
            case CommonAlgorithmState.FINAL:
                break;
        }
    }

    createInverseTransitionFunction() {
        this.log?.log("Creating inverse transition function for DFAs.");

        const allStates: State[] =
            this.mode === AlgorithmMode.EQUIVALENCE_TESTING
                ? this.input1.states.concat(this.input2.states)
                : this.input1.states;

        for (let state of allStates) {
            for (let symbol of this.input1.alphabet) {
                const transitionTo = state.transitions.get(symbol)!;
                if (!this.inverseTransitionFunction.has([transitionTo, symbol])) {
                    this.inverseTransitionFunction.set([transitionTo, symbol], new Set<State>());
                }
                this.inverseTransitionFunction.get([transitionTo, symbol]).add(state);
            }
        }

        for (let e of this.inverseTransitionFunction.entries()) {
            const stateName = e[0][0].name;
            const symbol = e[0][1];
            const statesTransitioningTo = Array.from(e[1]).map((el) => el.name);
            const singleState = statesTransitioningTo.length === 1;
            this.log?.log(
                `State${singleState ? "" : "s"} {${statesTransitioningTo.join(", ")}} transition${
                    singleState ? "s" : ""
                } to ${stateName} on input ${symbol}`
            );
        }
        this.state = HopcroftAlgorithmState.INVERSE_TRANSITION_FUNCTION_CREATED;
    }

    createInitialPartitions() {
        this.log?.log("Creating initial partitions of blocks of distinguishable states.");

        const allStates: State[] =
            this.mode === AlgorithmMode.EQUIVALENCE_TESTING
                ? this.input1.states.concat(this.input2.states)
                : this.input1.states;

        const acceptingStates =
            this.mode === AlgorithmMode.EQUIVALENCE_TESTING
                ? new Set([...this.input1.finalStates, ...this.input2.finalStates])
                : this.input1.finalStates;

        const nonAcceptingStates = new Set(allStates.filter((s) => !acceptingStates.has(s)));

        acceptingStates.forEach((s) => this.stateToBlockNumber.set(s, 1));
        nonAcceptingStates.forEach((s) => this.stateToBlockNumber.set(s, 2));
        this.blocks.set(1, acceptingStates);
        this.blocks.set(2, nonAcceptingStates);

        this.log?.log(
            `Created block 1 of accepting states: {${Array.from(acceptingStates)
                .map((s) => s.name)
                .join(", ")}}.`
        );
        this.log?.log(
            `Created block 2 of non-accepting states: {${Array.from(nonAcceptingStates)
                .map((s) => s.name)
                .join(", ")}}.`
        );

        this.state = HopcroftAlgorithmState.INITIAL_PARTITIONS_CREATED;
    }

    initializeStatesWithPredecessorSets() {
        this.log?.log("Initializing sets of states with predecessors for blocks 1 and 2");
        this.createStatesWithPredecessorsSets([1, 2]);
        this.state = HopcroftAlgorithmState.SETS_OF_STATES_WITH_PREDECESSORS_CREATED;
    }

    createStatesWithPredecessorsSets(blockNumbers: number[]) {
        for (let symbol of this.input1.alphabet) {
            for (let i of blockNumbers) {
                const block = this.blocks.get(i)!;
                const statesWithPredecessors = new Set<State>();
                for (let state of block) {
                    if (this.inverseTransitionFunction.get([state, symbol]) !== undefined) {
                        statesWithPredecessors.add(state);
                    }
                }
                this.statesWithPredecessors.set([symbol, i], statesWithPredecessors);

                if (statesWithPredecessors.size > 0) {
                    const singleState = statesWithPredecessors.size === 1;
                    this.log?.log(
                        `State${singleState ? "" : "s"} {${Array.from(statesWithPredecessors)
                            .map((s) => s.name)
                            .join(", ")}} in block ${i} have predecessors on input ${symbol}`
                    );
                } else {
                    this.log?.log(
                        `No states in block ${i} have any predecessors on input ${symbol}`
                    );
                }
            }
        }
    }

    createToDoLists() {
        this.log?.log("Creating to-do lists");
        for (let symbol of this.input1.alphabet) {
            const toDoList = new Set<number>();
            this.toDoLists.set(symbol, toDoList);
            const blockNumber =
                this.statesWithPredecessors.get([symbol, 1]).size <=
                this.statesWithPredecessors.get([symbol, 2]).size
                    ? 1
                    : 2;
            toDoList.add(blockNumber);
            this.log?.log(
                `Initialized to-do list for input ${symbol} as {${Array.from(toDoList).join(",")}}`
            );
        }
        this.state = HopcroftAlgorithmState.PARTITIONING_BLOCKS;
    }

    partitionBlocks() {
        const firstToDoList = Array.from(this.toDoLists.entries()).find(
            ([_, toDoList]) => toDoList.size > 0
        )!;
        const toDoListSymbol = firstToDoList[0];
        const blockNumber = firstToDoList[1].values().next().value as number;
        this.log?.log(
            `Picking an element from the to-do list for input ${toDoListSymbol} {${Array.from(
                firstToDoList[1]
            ).join(", ")}} to split predecessors of the selected block.`
        );
        this.toDoLists.get(toDoListSymbol)!.delete(blockNumber);
        this.log?.log(
            `Chose block number ${blockNumber}. The to-do list for input ${toDoListSymbol} is now {${Array.from(
                firstToDoList[1]
            ).join(", ")}}`
        );

        const block = this.blocks.get(blockNumber)!;
        const predecessors = Array.from(block)
            .map((s) => this.inverseTransitionFunction.get([s, toDoListSymbol]))
            .filter((s) => s !== undefined)
            .reduce((acc, value) => {
                value.forEach((s) => acc.add(s));
                return acc;
            }, new Set());

        if (predecessors.size === 0) {
            this.log?.log(
                `Block ${blockNumber} has no predecessors on input ${toDoListSymbol}. No blocks will be split.`
            );
        }

        const blocksToBeSplit = new Map<number, Set<State>>(); // block number -> states in the block that will be partitioned into a new block
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
            const existingBlock = this.blocks.get(splitBlockNumber)!;
            if (newBlock.size < existingBlock.size) {
                const bk = new Set([...existingBlock].filter((x) => !newBlock.has(x)));
                this.blocks.set(this.k, bk);
                this.blocks.set(splitBlockNumber, newBlock);
                bk.forEach((state) => this.stateToBlockNumber.set(state, this.k));
                this.log?.log(
                    `Split block ${splitBlockNumber} from {${Array.from(existingBlock)
                        .map((s) => s.name)
                        .join(", ")}} into {${Array.from(newBlock)
                        .map((s) => s.name)
                        .join(", ")}} (new block ${splitBlockNumber}) and {${Array.from(bk)
                        .map((s) => s.name)
                        .join(", ")}} (block ${
                        this.k
                    }). On input ${toDoListSymbol} all states in new block ${splitBlockNumber} transition to block ${blockNumber} while none of the states in block ${
                        this.k
                    } do.`
                );

                this.log?.log(
                    `Updating sets of states with predecessors for blocks ${splitBlockNumber} and ${this.k}`
                );
                this.createStatesWithPredecessorsSets([splitBlockNumber, this.k]);
                for (let s of this.input1.alphabet) {
                    const numberAddedToToDoList =
                        !this.toDoLists.get(s)!.has(splitBlockNumber) &&
                        this.statesWithPredecessors.get([s, splitBlockNumber]).size > 0 &&
                        this.statesWithPredecessors.get([s, splitBlockNumber]).size <=
                            this.statesWithPredecessors.get([toDoListSymbol, this.k]).size
                            ? splitBlockNumber
                            : this.k;
                    this.toDoLists.get(s)!.add(numberAddedToToDoList);

                    this.log?.log(
                        `Added ${numberAddedToToDoList} to the to-do list for input ${s}, it is now {${Array.from(
                            this.toDoLists.get(s)!
                        ).join(", ")}}`
                    );
                }
                this.k++;
                this.log?.log(`Incrementing k. It is now ${this.k}.`);
            } else {
                this.log?.log(
                    `All predecessors of block ${blockNumber} transition to block ${blockNumber} on input ${toDoListSymbol}. Therefore no blocks can be split.`
                );
            }
        }

        if (Array.from(this.toDoLists.values()).every((toDoList) => toDoList.size === 0)) {
            this.log?.log(
                "All to-do lists are empty, therefore all partitions have been identified."
            );
            this.log?.log(
                `Final blocks: ${Array.from(this.blocks.values())
                    .map(
                        (set) =>
                            "{" +
                            Array.from(set)
                                .map((s) => s.name)
                                .join(", ") +
                            "}"
                    )
                    .join(", ")}`
            );
            this.state = HopcroftAlgorithmState.ALL_BLOCKS_PARTITIONED;
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
                `Starting states ${q1.name} and ${q2.name} are both in block ${q1Block}, therefore they are indistinguishable and the DFAs are equivalent`
            );
        } else {
            this.result = EquivalenceTestingResult.NON_EQUIVALENT;
            this.log?.log(
                `Starting states ${q1.name} and ${q2.name} are in different blocks (blocks ${q1Block} and ${q2Block} respectively), therefore they are indistinguishable the DFAs are non-equivalent`
            );
        }

        if (!this.produceWitness) {
            this.state = CommonAlgorithmState.FINAL;
        } else {
            // this.state = TableFillingAlgorithmState.CONSTRUCTING_WITNESS;
        }
    }

    combineIndistinguishableGroups() {
        if (this.blocks.size === this.input1.states.length) {
            this.log?.log(
                "All states in the DFA are in separate blocks. Every state can be distinguished from all others, therefore the DFA is already minimal."
            );
        } else {
            const blocksToBeComined = Array.from(this.blocks.values()).filter((b) => b.size > 1);
            this.log?.log(
                `All states that are in the same block can be combined into a single state in a minimal DFA. The states that can be combined are ${blocksToBeComined
                    .map((states) => `{${Array.from(states).map((s) => s.name)}}`)
                    .join(", ")}`
            );
            this.log?.log("Creating minimized DFA.");
            this.result = minimizer.combineStates(
                this.input1,
                blocksToBeComined.map((s) => Array.from(s))
            );
        }
        this.state = CommonAlgorithmState.FINAL;
    }

    witness: string;
    inverseTransitionFunction: HashMap<[State, string], Set<State>>;
    blocks: Map<number, Set<State>>;
    statesWithPredecessors: HashMap<[string, number], Set<State>>;
    toDoLists: Map<string, Set<number>>;
    stateToBlockNumber: Map<State, number>;
}
