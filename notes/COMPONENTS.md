# COMPONENTS

-   Hardhat comes with following components
    -   Hardhat Network
    -   Hardhat Network Helpers
    -   Hardhat Runner
    -   Hardhat Chai Matchers
    -   Hardhat VSCode

I will go through key components and functionality here

---

## Hardhat Network

-   Hardhat comes with a built-in hardhat network - local ethereum network node designed for development
-   Allows us to deploy code, run tests and debug code, all within confines of local machine

-   Services JSON-RPC and Web socket requests
-   **By default, it mines a block with each transaction that it receives, in order and instantly**
-   Backed by @ethereum/vm implementation - same used by Ganache and Remix

-   When hardhat executes your tasks or scripts, a hardhat ethereum node is fired up on local machine
-   All hardhat plugins (ethers.js/web3.js) will directly connect with local node
-   hardhat network is simply one of the networks by default - you can be explicit by

`yarn hardhat run scripts/dummy.ts --network hardhat`

-   Alternatively, we can run in standalone mode by typing
    `yarn hardhat node`

-   Any external client including Metamask, your Dapp front-end can connect to this node
-   This will start Hardhat network, and expose it as a JSON-RPC/Websocket server
-   Connect your wallet or application to `http://127.0.0.1:8545`. Just use `--network localhost` for connecting with this server
-   Stack trace - incase of errors, we get a stack of both JS and solidity errors - starts with JS and stacks up and goes all the way to Solidity stack trace

**Console log**

-   `console.log` - Hardhat network supports logging of contract variables and messages within solidity
-   simply import `hardhat/console.sol` in your solidity contract and start logging variables. For eg

```
    pragma solidity ^0.8.7;
    import "hardhat/console.sol";

    contract C{

        uint256 public s_ctr;
        uint256 public s_changeCtr;

        function increment(uint256 _value) public returns(bool){
            s_ctr+= _value;
            s_changeCte +=1;

            console.log("Counter changed %s times and current value is %s", s_changeCtr, s_ctr);

        }

    }
```

-   Console consumes some gas in live networks - be careful when deploying on mainnet - should not have excessive logs (if any, not recommended)

**Mainnet forking**

-   One of the most powerful concepts of hardhat
-   copies state of mainnet blockchain onto local environment - all contracts deployed on mainnet will be accessible to us & we can test their behavior using local eth
-   Testing contracts that use external contracts (for eg. Defi protocols, oracles) - this is an indispensable tool we have

-   Hardhat network can be used to fork any EVM-compatible blockchain, not just Ethereum

To fork a mainnet fork

```
    $yarn hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key>
```

Alternately we can set it up in config file

```
networks:{
    hardhat-fork:{
        forking:{
            url: "https://eth-mainnet.alchemyapi.io/v2/<key>"
        }
    }
}
```

And then use `--network hardhat-fork` to make the node access mainnet fork

_Pinning a block_

-   Forking, by default, forks from latest block;. However, we might want to fork from a specific block - infact it is recommended by hardhat because
    -   state your tests run against might change if new blocks are added - can cause different behavior
    -   pinning enables caching - everytime data is fetched from mainnet, it is cached. if you don't pin, caching will not work as it has to get new blocks each time - will slow down the process

To pin a block number, simply do

```
networks:{
    hardhat-fork:{
        forking:{
            url: <alchemy>,
            blockNumber: 14390000
        }
    }
}
```

You can also specify it as a task (not recommended, very verbose)

```
    $yarn hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key> --fork-block-number 14390000
```

We can add custom

**Mining mode**

-   Hardhat network can be configured to immediately mine blocks as soon as a new txn comes or block in intervals

-   interval mining incorporates as many txns from the last block timestamp in current block

-   We can use on of these modes, or neither. by default, automining is enabled. If none is selected, no new blocks are mined - mining can be done on demand by calling evm_mine RPC method - when this is called, it tries to incorporate as many pending txns as possible

**Logging**

-   Hardhat network supports extensive logging that helps debugging contracts

-   We can get debug traces of already mined transactions using `debug_traceTransaction` RPC method. Returned object has a detailed description of txn execution, including list of steps describing each executed opcode and state of EVM at that point

-   if we use mainnet forking with an archive node, we can get traces of transactions from remote network using `debug_traceTransaction` - even if local node does not support this

-   ***

## Hardhat Network Helpers

### Overview

-   Provides a convenient JS interface to JSON-RPC functionality of Hardhat Network
-   `Hardhat Network` exposes its functionality through JSON-RPC-API
-   However interfacing is noisy, verbose and needs extensive conversion of input/output data
-   Network helpers package provides quick and easy interfaction with Hardhat Network

### Mine a block

`mine([blocks], [options])` - mines a specific number of blocks. defaults to 1.
