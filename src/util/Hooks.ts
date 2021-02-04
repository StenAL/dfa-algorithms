import { useState } from "react";

export function useForceUpdate() {
    const [, setValue] = useState(0);
    return () => setValue((value) => value + 1); // update the state to force render
}
