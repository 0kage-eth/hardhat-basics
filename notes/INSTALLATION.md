# HARDHAT INSTALLATION & SETUP

## Introduction

-   Hardhat is a development environment for Ethereum
-   Hardhat projects are `Nodejs` projects with `hardhat` package installed and a `hardhat.config.ts` file (typescript)
-   It supports editing, compiling, deploying and testing smart contracts and dApps
-   We interact with Hardhat Runner - main component that helps in running tasks
-   Hardhat is designed around concept of tasks and plugins
-   Everytime we write a command on console, we are running a task, eg.

                  yarn hardhat compile

    runs a built-in `compile` task

---

## Installation

To initialize `node js`, we run in terminal

                yarn init -y

Then we need to install `hardhat`

                yarn add --dev hardhat

To create a new Hardhat project, we do

                yarn hardhat

You should see the following options

![Hardhat configuration](./images/hardhat-project.png)

Let us pick typescript as it is recommended by Hardhat team

We can check all options and available tasks by doing

                yarn hardhat

You should see a list of global options and tasks

![Hardhat Tasks](./images//hardhat-tasks.png)

Install following packages to get typescript specific functionality of Hardhat

            yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv @typechain/ethers-v5 @typechain/hardhat @types/chai @types/mocha @types/node ts-node typechain typescript

We can also install recommended `@nomicfoundation/hardhat-toolbox`. This comes with everything we need, including - `chai` and `mocha` and `hardhat chai matchers` - `ethers.js` and `hardhat-ethers` plugin - `hardhat network helpers` - `hardhat-etherscan` for verifying contracts - `hardhat-gas-reporter` for calculating gas esitimates - `solidity-coverage` measuring testing coverage - `Typechain` if using typescript

---

## Configuration

When hardhat is run, it searches for the closest hardhat.config.ts. It is usually in root folder and contains all the configuration for hardhat to work

To setup a config file, we need to export an object from hardhat.config.js

This object can have entries for

-   network (specify network name, url, accounts, chainId etc)
-   solidity (solidity versions to compile)
-   paths - configure paths for testing/scripts/contracts etc (_leave it untouched. default settings are good_)
-   defaultNetwork - network that gets connected by default
-   mocha - specify parameters for testing

`networks` field maps network to its configuration. 2 kinds of networks - JSON-RPC based network and built-in hardhat network

We can set `defaultNetwork` - which gets connected if we don't explicitly specify network

**Hardhat network**

Hardhat comes built in with a special network called `hardhat` - when using this network, instance of hardhat network is automatically created to run a task/script or test smart contracts

**JSON-RPC based network**

Networks that connect to an external node - this node can be running on local machine (eg. ganache) or infrastructure provider such as infura/alchemy

To configure a JSON-RPC based network, some important fields in the config object

-   _url_: JSON RPC url of node provider. Not needed for local
-   _chainId_: chain id of connected chain
-   _accounts_: specifies which account Hardhat uses. It can use node accounts by setting to `remote`, list of local accounts (by providing an array of private keys). Default value is `remote`
-   _from_: address to use as default sender. If not specified, automatically pics first account
-   _gas_: value should be `auto` or 0. If value specified, it will be gas limit for every transaction by default. If `auto`, gas limited is automatically estimated (this is default)
-   _gasPrice_ - should be `auto'. If specified, it will be max gas price for txns
-   _gasMultiplier_ - a number used to add some slack to gas. default value is 1.
-   _timeout_ - timeout in ms for requests sent to network. for local, default is 40000, for other networks 20000

**solidity**

Solidity object specifies the configuration of compiler. We can provide multiple configurations as well

Multiple compiler versions can be specifed as follows

            solidity: {
                compilers: [
                    {
                        version: "0.8.7",
                    },
                    {
                        version: "0.6.6",
                    },
                    {
                        version: "0.4.24",
                    },
                ],
            },

**mocha**

Mocha is the testing framework used by hardhat. Most important setting here is `timeout` - specially needed when we run tests on external networks

            mocha: {
                timeout: 200000, // 200 seconds max for running tests
            },

---

### Setting up a project

Once a hardhat project is initiated, we notice that there are following folders created

-   `contracts` - all solidity contracts go here
-   `scripts` - all scripting logic goes here
-   `test` - all unit and integration tests go here

### Libraries

Harhdat comes with some useful functionality provided by embedded libraries

-   `Ethers.js` - For connecting with contracts, managing wallets etc
-   `Chai` - chai is an assertion library and `Mocha` is the test runner
-   `Hardhat Network` - helps run a local chain for local testing
-   `Hardhat Network Helper` - provides a javascript interface to JSON-RPC functionality of hardhat network

### Plugins and dependencies

Plugins are the backbone of hardhat - most hardhat functionality is extended via plugins

Add a plugin by importing it into `harhdat.config.ts` as below

                import "@nomicfoundation/hardhat-toolbox";

---
