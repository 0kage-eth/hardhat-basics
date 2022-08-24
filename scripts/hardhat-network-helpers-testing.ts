import {
    mine,
    mineUpTo,
    setBalance,
    setCode,
    setNonce,
    impersonateAccount,
    time,
} from "@nomicfoundation/hardhat-network-helpers"
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

/** mines a new block whose timestamp is timestamp we send */
const increaseTimeTo = async (timeStamp: number) => {}

const setNextBlockTimestamp = async (timestamp: number) => {}

const takeSnapshot = async () => {}

const loadFixture = async () => {}

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
    await increaseTime(500)
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
