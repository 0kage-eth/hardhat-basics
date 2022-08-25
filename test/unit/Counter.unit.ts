import hre from "hardhat"
import { loadFixture, mine } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { TransactionRequest } from "@ethersproject/providers"
import { expect } from "chai"
import { Counter, Counter__factory } from "../../typechain-types"

describe("Chai matchers functionality", () => {
    let contract: Counter
    let initialValue: number = 10,
        min: number = 5,
        max: number = 100000
    const deployFixture = async () => {
        const [deployer, ...others] = await hre.ethers.getSigners()

        const counterContractFactory: Counter__factory = await hre.ethers.getContractFactory(
            "Counter",
            deployer
        )

        const counterContract = await counterContractFactory.deploy(initialValue, min, max)
        return counterContract
    }

    beforeEach(async () => {
        contract = await loadFixture(deployFixture)
    })

    /**
     * @dev used different variants of error checkings
     * @dev 4 variants - reverted, revertedWith, revertedWithCustomError, revertedWithoutReason
     */
    describe("Exception tests", () => {
        it("test for all exceptions", async () => {
            const input = 3

            // out of range expection should be thrown here - range is defined by min /max defined above
            await expect(contract.setCounter(input))
                .to.be.revertedWithCustomError(contract, "Counter__OutofRange")
                .withArgs(min, max, input)

            // 'increment has to be positive' exception should be thrown here
            await expect(contract.increment(0)).to.be.revertedWith("increment has to be positive")

            // 'decrement should be both in range and an odd number - simple revert here to be thrown,
            await expect(contract.decrement(2)).to.be.revertedWithoutReason()
        })
    })

    /**
     * @dev tests to check if events are emitted properly
     * @dev examples show events emitted with/without arguments
     */

    describe("Event emitter tests", () => {
        it("reset event emitter test", async () => {
            await expect(contract.resetCounter()).to.emit(contract, "ResetCounter")
        })

        it("set counter event emitter test", async () => {
            await expect(contract.setCounter(20)).to.emit(contract, "SetCounter").withArgs(20)
        })

        it("increment counter with any value", async () => {
            await expect(contract.increment(10))
                .to.emit(contract, "Increment")
                .withArgs(10, () => true) // second value does not matter => function represents that any value is accepted, only first value has to match increment
        })
    })
})
