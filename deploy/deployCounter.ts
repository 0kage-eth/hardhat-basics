/**
 * @dev script here deploys the counter contract
 */

import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"

const deployCounter: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    try {
        const { deployments, getNamedAccounts } = hre

        const { deploy, log } = deployments

        log("Deploying Counter contract.......")

        const { deployer } = await getNamedAccounts()

        const tx: DeployResult = await deploy("Counter", {
            from: deployer,
            args: [5, 1000000, 10],
            log: true,
            waitConfirmations: 1,
        })

        log(
            `contract deployed successfully. Transaction hash is ${tx.transactionHash}, address is ${tx.address}`
        )
        log("------------------------")
    } catch (e) {
        console.error(e)
    }
}

export default deployCounter

deployCounter.tags = ["all", "counter"]
