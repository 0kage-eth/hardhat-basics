import { TransactionRequest } from "@ethersproject/providers"
import {
    mine,
    mineUpTo,
    setBalance,
    setCode,
    setNonce,
    impersonateAccount,
    time,
    takeSnapshot,
    loadFixture,
} from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import hre, { ethers } from "hardhat"
import { parse } from "path"

/**
 * @notice Example showing mine() feature in harhat-network-helper
 * @notice mine allows us to change block number, either instantly or with a specific time interval
 * @notice Refer to HARDHAT-NETWORK-HELPERS.md for more on this
 */
const mining = async () => {
    /**
     * @dev mine 1 block
     * @dev default option is 1 block
     */

    console.log(
        `Starting mining using mine()...current block number is ${await hre.ethers.provider.getBlockNumber()}`
    )
    await mine()
    console.log(
        `mining completed. block number shifts to ${await hre.ethers.provider.getBlockNumber()}`
    )
    console.log("------------")

    /**
     * @dev - mine 100 blocks instantly
     */
    console.log(
        `Starting mining using mine(100)...current block number is ${await hre.ethers.provider.getBlockNumber()}`
    )
    await mine(100)

    console.log(
        `mining completed. block number shifts to ${await hre.ethers.provider.getBlockNumber()}`
    )
    console.log("------------")

    /**
     * @dev we can also include a time interval between blocks
     * @dev here i am mining 2 blocks with an interval of 1 second between them
     */

    await mine(2, { interval: 1 }) // interval is in seconds

    const block0 = await hre.ethers.provider.getBlock(0)
    const block1 = await hre.ethers.provider.getBlock(1)

    console.log("Timestamps between both blocks should be separated by 1 second")
    console.log(`timestamps for block 0: ${block0.timestamp}, block 1: ${block1.timestamp}`)
}

/**
 * @notice miningUpto mines blocks instantly until blockNumber equals latest block
 */
const miningUpto = async (blockIncrement: number) => {
    const currentBlock = await hre.ethers.provider.getBlockNumber()
    console.log("Starting with block number:", currentBlock)

    /**
     * @dev mineUpto mines upto block number
     * @dev block number should always be greater than latest block
     * @dev in this case, I'm finding current Block Number and adding 100 to it
     */
    await mineUpTo(currentBlock + blockIncrement)
    const lastBlock = await hre.ethers.provider.getBlockNumber()
    console.log("Mining stopped at block number:", lastBlock)

    console.log("------------")
}

/**
 * @notice method is used to manipulate balance in a given acocunt
 * @param manipulatedBalance new balance forced onto the wallet address. This is defined in string terms
 */
const manipulateBalance = async (manipulatedBalance: string) => {
    const ethers = hre.ethers
    const accounts = await ethers.getSigners()

    const zeroWalletAddress = accounts[0].address
    const currentBalance = await ethers.provider.getBalance(zeroWalletAddress)

    console.log(`Actual wallet balance is ${ethers.utils.formatUnits(currentBalance, "ether")} ETH`)

    await setBalance(zeroWalletAddress, ethers.utils.parseEther(manipulatedBalance))

    const newBalance = await ethers.provider.getBalance(zeroWalletAddress)
    console.log(
        `Manipulated wallet balance is ${ethers.utils.formatUnits(newBalance, "ether")} ETH`
    )
}

/**
 * @notice assign code to an address
 * @dev run this code with network chosen as mainnet (notice that mainnet is forked)
 * @dev we get bytecode of weth contract on mainnet and set that code to account[0]
 * @dev account[0] refers to the first of dummy accounts setup by hardhat server
 * @dev note that before setting code, contract code is "0x" (no code since its Externally owned account)
 * @dev now we are setting code to that account
 */
const assignCode = async () => {
    const wethContractAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

    const account = (await hre.ethers.getSigners())[0]

    const contractCodeBefore = await hre.ethers.provider.getCode(account.address)

    // I get the bytecode for weth contract from mainnet
    const wethByteCode = await hre.ethers.provider.getCode(
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    )

    // you can cross-verify this by looking at byte code on etherscan
    // go to link https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
    // check contract creation code

    console.log("weth contract", wethByteCode)

    await setCode(account.address, wethByteCode)

    const contractCodeAfter = await hre.ethers.provider.getCode(account.address)

    console.log("contract code before setCode()", contractCodeBefore)

    console.log("contract code after setCode()", contractCodeAfter)
}

/**
 * @notice changes nonce associated with a specific address using setNonce
 * @notice note that nonce is a number assigned to each address - sum total of txns sent from that address
 */
const assignNonce = async () => {
    const account0 = (await hre.ethers.getSigners())[0]

    const account0Address = account0.address

    // transaction count is the nonce for address
    // it is sum total of all txns sent from the address
    console.log(
        "Nonce before setNonce()",
        await hre.ethers.provider.getTransactionCount(account0Address)
    )

    await setNonce(account0Address, 500)

    console.log(
        "Nonce after setNonce()",
        await hre.ethers.provider.getTransactionCount(account0Address)
    )
}

/**
 * @dev Allows hardhat network to impersonate an account
 * @dev any contracts can be be signed by this impersonator account
 * @dev ofcourse this does not happen on mainnet addresses
 *
 */
const mimicAccount = async () => {
    const ethers = hre.ethers
    const wethContractAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

    await impersonateAccount(wethContractAddress)

    const signer = await ethers.getSigner(wethContractAddress)
    const balance = await ethers.provider.getBalance(signer.address)
    console.log("impersonated account", signer.address)
    console.log("impersonated account balance", ethers.utils.formatEther(balance))

    // const tx2 = await
}

/**
 * @notice time in network-hardhat-helper allows us to play with time
 * @notice this is very useful to test contracts whose behavior changes with time
 * @dev time.increase() changes time and mines a new block
 * @param numSeconds number of seconds we want to increase
 */
const increaseTime = async (numSeconds: number) => {
    const accounts = await hre.ethers.getSigners()

    const from = accounts[0]
    const to = accounts[1]

    // mine a block

    await mine()
    const latestBlockNumber = await time.latestBlock()
    const block = await hre.ethers.provider.getBlock("latest")
    // get latest timestamp and block number
    console.log(`Timestamp of block number ${latestBlockNumber} is ${block.timestamp}`)

    // increase time by 500 seconds
    await time.increase(numSeconds)
    //    await mine()

    const futureBlockNumber = await time.latestBlock()
    const futureBlock = await hre.ethers.provider.getBlock("latest")

    // get latest timestamp and block number
    console.log(`Timestamp of block number ${futureBlockNumber} is ${futureBlock.timestamp}`)
}

/**
 * @dev mines a new block whose timestamp is timestamp we send
 * */

const increaseTimeTo = async () => {
    const ethers = hre.ethers
    let block = await ethers.provider.getBlock("latest")
    console.log(`current block: ${block.number}, timestamp: ${block.timestamp}`)

    // increase time to our input timestamp
    // adds a block with current timestamp
    await time.increaseTo(block.timestamp + 1000)
    console.log(` increasing time to ${block.timestamp + 1000} ...`)
    block = await ethers.provider.getBlock("latest")
    console.log(`current block: ${block.number}, timestamp: ${block.timestamp}`)
}

/**
 * @dev setNExtBlockTimestamp sets timestamp of next block
 * @dev but doesn't mine one - we need to mine manually or add a txn (so that network automines) to see the effecyt
 * @dev in curren example, I am manually mining the next block
 */
const nextBlockTimestamp = async () => {
    let block = await hre.ethers.provider.getBlock("latest")

    console.log(`current block ${block.number},timestamp ${block.timestamp}`)
    console.log(`calling setNextBlockTimestamp by adding 1000 to current timestamp`)

    await time.setNextBlockTimestamp(block.timestamp + 1000)

    await mine(1)
    block = await hre.ethers.provider.getBlock("latest")
    console.log(`current block ${block.number},timestamp ${block.timestamp}`)
}

/**
 * @dev takes snapshot and provides a 'restore' method to get back to original state
 * @dev I will transfer 1 eth between accounts, set time stamp of next block & mine a new block
 * @dev then i will try to restore old snapshot
 */
const useSnapshot = async () => {
    const accounts = await hre.ethers.getSigners()

    // capturing a snapshot of chain
    let snapshot = await takeSnapshot()

    let sender = accounts[0]
    let receiver = accounts[1]
    let txn: TransactionRequest = { to: receiver.address, value: hre.ethers.utils.parseEther("1") }
    let tx = await sender.sendTransaction(txn)

    // adds 1000 seconds to next mined block
    await increaseTimeTo()

    let block = await hre.ethers.provider.getBlock("latest")

    let senderBalanceEth = hre.ethers.utils.formatEther(await sender.getBalance())
    let receiverBalanceEth = hre.ethers.utils.formatEther(await receiver.getBalance())

    console.log(
        `current block is ${block.number}, timestamp is ${block.timestamp}, sender balance is ${senderBalanceEth} eth, receiver balance is ${receiverBalanceEth} eth`
    )

    // restoring snapshot to a state before all these txns
    await snapshot.restore()

    console.log("--------------------------")
    console.log("snapshot restored... checking back on state...")
    block = await hre.ethers.provider.getBlock("latest")

    senderBalanceEth = hre.ethers.utils.formatEther(await sender.getBalance())
    receiverBalanceEth = hre.ethers.utils.formatEther(await receiver.getBalance())

    console.log(
        `current block is ${block.number}, timestamp is ${block.timestamp}, sender balance is ${senderBalanceEth} eth, receiver balance is ${receiverBalanceEth} eth`
    )
}

/**
 * @dev transactionsFixture is what gets called inside loadFixture once & state of chain is stored
 * @dev this is very helpful in testing when we don't have to generate the start state again & again
 * @dev fixture functions usually are used for deploying contracts - so the chain sent to testing already has these contracts live
 * @dev in current fixture, I transfer 1 ether from sender to receiver 1/2/3. I mine 3 blocks afterwards for finality
 */
const transactionsFixture = async () => {
    const [sender, receiver1, receiver2, receiver3, ...others] = await hre.ethers.getSigners()

    const sendValue = hre.ethers.utils.parseEther("1")
    const tx1: TransactionRequest = { to: receiver1.address, value: sendValue }
    const tx2: TransactionRequest = { to: receiver2.address, value: sendValue }
    const tx3: TransactionRequest = { to: receiver3.address, value: sendValue }

    //sendt 1 ether from sender to receiver1/2/3
    const txn1 = await sender.sendTransaction(tx1)
    const txn2 = await sender.sendTransaction(tx2)
    const txn3 = await sender.sendTransaction(tx3)

    //mine 3 blocks
    await mine(3)

    return { sender, receiver1, receiver2, receiver3 }
}
const useFixture = async () => {
    const { sender, receiver1, receiver2, receiver3 } = await loadFixture(transactionsFixture)
    const senderBalance = await sender.getBalance()
    console.log(`balance of sender wallet is ${ethers.utils.formatEther(senderBalance)} eth`)
}

const dropTransaction = async (txHash: string) => {}

const main = async () => {
    // Uncomment to run this
    // await mining()
    // Uncomment to run this
    // await miningUpto(100)
    // Uncomment to run this
    // await manipulateBalance("5")
    // Uncomment to run this
    //  await assignCode()
    // uncomment to run this
    // await assignNonce()
    // uncomment to run this
    // await mimicAccount()
    // uncomment to run this
    //await increaseTime(500)
    // uncomment to run this
    //await increaseTimeTo()
    //uncomment to run this
    //await nextBlockTimestamp()
    //uncomment to run this
    //await useSnapshot()
    //uncomment to run this
    await useFixture()
}

/** Run mining example */
main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
