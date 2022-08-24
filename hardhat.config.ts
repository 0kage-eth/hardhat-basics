import { extendEnvironment, HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"
import { task } from "hardhat/config"

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    defaultNetwork: "hardhat",
    networks: {
        local: {
            chainId: 31337,
            url: "",
        },
        hardhat: {
            chainId: 31337,
        },
        rinkeby: {
            chainId: 4,
            url: "",
        },
        mainnet: {
            chainId: 1,
            url: "",
        },
    },
}

/**
 * @dev here is how we create a new task in hardhat
 */
task("print-account", "Prints list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    accounts.map((account) => {
        console.log(account.address)
    })
})

export default config
