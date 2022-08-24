import { ethers } from "hardhat"

/**
 * @dev creating a new script that prints account aaddresses
 * @dev note that this same script is defined as a task inside hardhat.config.ts
 * @dev task and scripts are similar
 */
const printAccounts = async () => {
    const accounts = await ethers.getSigners()

    accounts.map((account) => console.log(account.address))
}

printAccounts()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
