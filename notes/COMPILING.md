# COMPILING CONTRACTS

## Basics

To compile contracts use

                $ yarn hardhat compile

Compiled contracts will be shared in `artifacts` folder

After initial compilation, if no changes are made, Hardhat does not compile contract again. If only one file is modified, only that file is recompiled.

To force compilation we can do

                $ yarn hardhat compile --force

To clean all existing contract files in `artifacts` we can do

                $ yarn hardhat clean

---

## Configuring compile

-   Hardhat recommends to always configure compiler to avoid unexpected errors
-   Configuring compiler includes version and settings

    ```
      module.exports = {
    solidity: {
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000,
        },
      },
    },
    };

    ```

-   `settings` include following
    -   `optimizer`: object with `enabled` and `runs` keys. Default is `{enabled: false, runs: 1000}`
    -   `evmversion`: string controlling target evm version - default is managed by `solc`
