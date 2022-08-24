/**
 * @dev Create a new task in Hardhat
 * @dev Hardhat comes with default tasks such as `test` and `compile`
 * @dev to define a custom task, we need to write a script
 * @dev 'hre' stands for hardhatRuntimeEnvironment that contains all functionality of hardhat and its plugins
 */

import { task } from "hardhat/config"

task("print-account", "Prints list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    accounts.map((account) => {
        console.log(account.address)
    })
})
