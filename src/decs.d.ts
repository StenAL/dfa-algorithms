declare module "viz.js/lite.render";
declare module "noam" {
    export type Automaton = Object;
    export interface FSM {
        parseFsmFromString: (data: string) => Automaton;
        printDotFormat: (automaton: Automaton) => string;
    }
    interface Noam {
        fsm: FSM;
    }
    const noam: Noam = {
        fsm: {},
    };
    export default noam;
}
