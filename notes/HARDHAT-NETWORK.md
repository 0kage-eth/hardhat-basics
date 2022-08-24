# Hardhat Network

## Network properties in Config.ts

-   You can set following propeties in network in hardhat.config.ts

```
    const config: HardhatUserConfig = {
        networks: {
            hardhat: {
                chainId: 31337,
                from:,
                gas: auto, // if a number is used, it becomes a gas limit for txn
                gasMultiplier: , // number used to multiply results of gas to give some slack
                accounts: [], //an array of initial accounts, each having private key and balance
                blockGasLimit: auto, block gas limit to use in hardhat network's blockchain. default is 30,000,000
                forking: {
                    url:, // network provider API endpoint
                    blockNumber:, // blocknumber from which to fork
                    enabled:, //default value is true if url is set, or false
                }, // object that represents forking configuration

                chains: {
                    1: {
                        hardforkHistory:,

                    },
                    31337: {

                    }

                },

                minGasPrice:
                initialBaseFeePerGas: , // `baseFeePerGas` of first blovk
            }
        }
    }

```

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

---

## Console log

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

-   You can call console.log for upto 4 parameters in any order for following tupes
    -   `uint`
    -   `string`
    -   `bool`
    -   `address`

---

## Mainnet forking

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

---

## Mining mode

-   Hardhat network can be configured to immediately mine blocks as soon as a new txn comes or block in intervals

-   interval mining incorporates as many txns from the last block timestamp in current block

-   We can change mining mode in runtime as follows

```
    await network.provider.send("evm_setAutomine", [false])

    await network.provider.send("evm_setIntervalMining, [5000]) // pass time in seconds
```

-   If automining is set to false, all txns by default go to mempool. And order of picking txns is in descending order of gas fees (just like in real world)

-   When automine is false, pending txns can be queried with `eth_getBlockByNumber` RPC method - with `pending` as block number argument

```
    const pendingTxns = await network.provider.send("eth_getBlockByNumber", ["pending", false])
```

Above code returns all pending txns that will be sent to next block

-   When automine is false, we can manually mine new blocks using `evm_mine` RPC method

-   A pending txn can be removed using `hardhat_dropTransaction` RPC method

```
    const txnHash = "0xasas233....."
    await helpers.dropTransaction(txHash)

```

-   A pending txn can be replaced by adding a new txn with same nonce but with 10+% increase in fee paid to miner

-   We can use on of these modes, or neither. by default, automining is enabled. If none is selected, no new blocks are mined - mining can be done on demand by calling evm_mine RPC method - when this is called, it tries to incorporate as many pending txns as possible

---

## Logging

-   Hardhat network supports extensive logging that helps debugging contracts

-   We can get debug traces of already mined transactions using `debug_traceTransaction` RPC method. Returned object has a detailed description of txn execution, including list of steps describing each executed opcode and state of EVM at that point

We can generate trace for any address by doing following

```
    const trace = await hre.network.provider.send("debug_traceTransaction", ["0x13334assd....])
```

-   if we use mainnet forking with an archive node, we can get traces of transactions from remote network using `debug_traceTransaction` - even if local node does not support this

---

## Impersonating accounts

-   Hardhat network allows us to impersonate accounts

-   Lets you send txns from that account even if you don't have private key

-   use `ethers.getImpersonatedSigner()` method added to the `ethers` object by `hardhat-ethers` plugin

```
    // if we have address of impersonator, we can do this
    const impersonatedSigner = await ethers.getImpersonatedSigner(<address>)
    await impersonatedSigner.sendTransaction(..)
```

Alternatively, we cna use hardhat-helper to impersonate account and use the normal getSigner() method in ethers

```
    import helpers from "@nomicfoundation/hardhat-network-helpers";
    const address = "0x1234567890123456789012345678901234567890";

    await helpers.getImpersonatedAccount(address);

    const impersonatedSigner = await ethers.getSigner(address);
```

---

## Resetting fork

We can always reset the fork to a given block number again by running

```
    await network.provider.request({
        method: "hardhat_reset",
        params: [
            {
                forking: {
                    jsonRpcUrl: ""
                    blockNumber: 143900000,
                }
            }
        ]
    })
```

Similarly, you can disable forking by passing empty params

```
    await network.provider.request({
        method: "hardhat_reset",
        params: []
    })

```

---

## Initial State

-   On `yarn hardhat node`, a new chain is initialized with genesis block
-   20 accounts with 10000 ETH each are generated

---

## Special functions

-   Special functions supported in hardhat.network are

    -   `evm_increaseTime`
    -   `evm_mine`
    -   `evm_revert`
    -   `evm_setAutomine`
    -   `evm_setBlockGasLimit`
    -   `hardhat_impersonateAccount`
    -   `hardhat_mine`

    All these functions are very verbose - to make intefacing with these easy, we have the hardhat-network-helper component.
