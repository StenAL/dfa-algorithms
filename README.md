# dfa-algorithms

[https://dfa.laane.xyz/](https://dfa.laane.xyz/)

```
Finite State Machine Educational Tools: Implementing Equivalence Testing and State Minimization Algorithms
```

6CCS3PRJ Final Year Project for King's College London  
Author: Sten Arthur Laane  
Supervisor: Dr Agi Kurucz

## About

This project aims to implement and visualize three [Finite Automata](https://en.wikipedia.org/wiki/Finite-state_machine)
algorithms used for [state minimization](https://en.wikipedia.org/wiki/DFA_minimization) (SM) and equivalence testing (
ET):

-   The Table-Filling Algorithm (SM, ET)
-   The n lg n Hopcroft Algorithm (SM, ET)
-   The (Nearly) Linear Algorithm (ET)

Variants of these algorithms that produce witness strings to indicate whether two DFA are equivalent are also
implemented.

Additionally, the project aims to demonstrate the algorithms' worst-case performance using custom DFA datasets. These
datasets are made available to users for creating their own DFAs.

Further details on the algorithms and datasets can be found in the report accompanying the project, found [here](public/report.pdf).

Instructions on using the app can be found on the [help page](src/components/Help.tsx).

## Development

To run or develop this software locally, a local installation of [node.js 14.x](https://nodejs.org/en/) is required.

The software can be run as follows:

1. Navigate to the project directory
2. Install necessary dependencies using `npm install`
3. Run the local development server `npm run start`
4. Access the site at `http://localhost:3000`

Tests can be run using `npm run test`

## Contributing and Issues

Contributions are always welcome. Anyone can open issues and
pull requests on [GitHub](https://github.com/StenAL/dfa-algorithms)

## License

This project is licensed under the [MIT license](LICENSE)
