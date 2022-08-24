# Hardhat Network Helpers

## Overview

-   Provides a convenient JS interface to JSON-RPC functionality of [Hardhat Network](./HARDHAT-NETWORK.md)
-   `Hardhat Network` exposes its functionality through JSON-RPC-API
-   However interfacing is noisy, verbose and needs extensive conversion of input/output data
-   Network helpers package provides quick and easy interfaction with Hardhat Network

---

## Mine a block

`mine([blocks], [options])`

    -   mines a specific number of blocks. defaults to 1.
    -   `options` we can give a time interval in seconds. `{interval: 15}` assigns timestamp 15 seconds apart from consecutive blocks

`mineupto(blockNumber)`

    - mines blocks upto a specific block number
    - make sure that block number is more than latest block

Refer to examples in [hardhat-helper-examples.ts](../scripts/hardhat-network-helpers-testing.ts)

## Manipulating accounts

`setBalance(address, balance)`

    -   sets balance of an address to given value
    -   note that balance is in wei

`setCode(address, code)`

    -   modifies code bytecode in account address
    -   code here is a bytecode

`impersonateAccount(address)` - hardhat can sign txns as given address - address here refers to address we want to impersonate. We can pick contracts from mainnet by forking it safely

`stopImpersonatingAccount(address)` - Stops hardhat network from impersonating this address

## Time helpers

`increase(amountInSeconds)`

-   Sometimes we need to replicate passage of time to test contracts
-   Specially useful for timelock contracts, vesting, staking returns calculations etc
-   increase() function is a very good tool that helps in increasing time programatically
-   takes time in seconds

`increaseTo(futuretimestamp)`

-   This function shifts block to a timestamp that matches with one we pass
-   Previous function we increased time by a specific amount - in this we move time to specific timestamp
-   timestamp must be greater than current timestamp

`setNextBlockTimestamp(timestamp)`

-   Sets next block timestamp as theone we pass
-   Note that in this case, we don't mine a new block
-   timestamp must be greater than current time stamp

Refer to examples in [hardhat-helper-examples.ts](../scripts/hardhat-network-helpers-testing.ts)

## Snapshot

`takeSnapshot()`

-   takes snapshot of blockchain state as on current block
-   returns an object with a `restore` method that can be used to reset network to state in snapshot
