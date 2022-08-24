# HARDHAT RUNTIME ENVIRONMENT

## Introduction

-   Hardhat runtime environment (HRE) is an object containing all functionality that hardhat exposes when running a task, test or script

-   Hardhat is the HRE

-   when we initialize hardhat `import {hre} from "hardhat"` we are using `hardhat.config` to add a list of things to be added to HRE - these include tasks, configs and plugins

-   plugins can inject functionality that becomes available everywhere HRE is accessible

-   By default, HRE gives programmatic access to task runner, config system and exports a EIP-1193 compatible ethereum provider

-   Plugins extend HRE - for eg. `hardhat-ethers` plugin adds a `ethers.js` instance, making it available to tasks, scripts and tests

-   Before running a task, test or script - hardhat injects HRE into global scope, turning all its fields to global variables

-   Once task is completed, global variables are removed

-   If you dont want global variables, you can also explicitly import HRE. Using `const {hre} = import("hardhat")` explicitly imports hre instance when writing tasks/script explicitly. This provides more flexibility as we don't have to depend on global variables

-   You can also extend HRE functionality by adding in more libraries. For eg, here is how I can add web3.js library to HRE

```
    extendEnvironment((hre) => {
  const Web3 = require("web3");
  hre.Web3 = Web3;

  // hre.network.provider is an EIP1193-compatible provider.
  hre.web3 = new Web3(hre.network.provider);
});
```
