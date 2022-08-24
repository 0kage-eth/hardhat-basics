import { mine } from "@nomicfoundation/hardhat-network-helpers"
import hre from "hardhat"

const mining = async () => {
    console.log(`Starting mining...current block number is ${hre.ethers.provider.blockNumber}`)
    await mine(10)

    console.log(`mining completed. current block number is ${hre.ethers.provider.blockNumber}`)
}

mining()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
