import { AlgorithmUrlString } from "../components/visualization/AlgorithmVisualization";
import { AlgorithmMode, AlgorithmType } from "../types/Algorithm";

export function getAlgorithmName(type: AlgorithmType | AlgorithmUrlString) {
    switch (type) {
        case "tableFilling":
        case "table-filling":
            return "Table-Filling Algorithm";
        case "tableFillingWitness":
            return "Table-Filling Algorithm (Witness)";
        case "hopcroft":
            return "n-lg-n Hopcroft Algorithm";
        case "hopcroftWitness":
            return "n-lg-n Hopcroft Algorithm (Witness)";
        case "nearly-linear":
        case "nearlyLinear":
            return "(Nearly) Linear Algorithm";
        case "nearlyLinearWitness":
            return "(Nearly) Linear Algorithm (Witness";
    }
}

export function getAlgorithmModes(type: AlgorithmType | AlgorithmUrlString) {
    switch (type) {
        case "table-filling":
        case "tableFilling":
            return [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
        case "tableFillingWitness":
            return [AlgorithmMode.EQUIVALENCE_TESTING];

        case "hopcroft":
            return [AlgorithmMode.EQUIVALENCE_TESTING, AlgorithmMode.STATE_MINIMIZATION];
        case "hopcroftWitness":
            return [AlgorithmMode.EQUIVALENCE_TESTING];
        case "nearly-linear":
        case "nearlyLinear":
        case "nearlyLinearWitness":
            return [AlgorithmMode.STATE_MINIMIZATION];
    }
}
