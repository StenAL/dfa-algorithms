import { default as Switch } from "react-switch";
import { default as Tooltip } from "react-tooltip";

interface WitnessSwitchProps {
    produceWitness: boolean;
    callback: (produceWitness: boolean) => void;
}

export default function WitnessSwitch({ produceWitness, callback }: WitnessSwitchProps) {
    return (
        <div className={"algorithm-switch"}>
            <span className={"switch-option right-align"}>No witness</span>
            <Switch
                checked={produceWitness}
                activeBoxShadow={"0 0 2px 2px #3bf"}
                onChange={() => callback(!produceWitness)}
                checkedIcon={false}
                uncheckedIcon={false}
                offHandleColor={"#89CFF0"}
                onHandleColor={"#89CFF0"}
                offColor={"#aaa"}
                onColor={"#aaa"}
                width={75}
            />
            <span className={"switch-option left-align"}>
                Witness string
                <span className={"info-tooltip"} data-tip data-for="witness-help">
                    ?
                </span>
            </span>
            <Tooltip
                place={"top"}
                type={"info"}
                id="witness-help"
                effect={"solid"}
                multiline={true}
            >
                <span>
                    A witness string is an example string that indicates why two DFA are not
                    equivalent, meaning one DFA accepts the witness while the other rejects it.
                    <br />
                    Computing a witness string takes more time and memory than just determining the
                    equivalence of DFAs.
                </span>
            </Tooltip>
        </div>
    );
}
