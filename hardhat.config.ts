import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers"

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

export default config
