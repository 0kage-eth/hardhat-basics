# TESTING CONTRACTS

## Writing Tests

After compiling contracts, next step is to test logic

-   We use `mocha` and `chai` libraries to run test. Also use `chai matchers` and `hardhat network helpers`
-   Hardhat team recommends `Typescript` because we can catch type errors and have better auto completion support
-   Below is a generic structure of a unit test

    -   `describe()` and `it()` are global mocha functions
    -   `describe()` -> takes test name & executes a callback
    -   `beforeEach()` -> executes logic before each test run
    -   `it()` -> each unit test is defined inside callback of it()
    -   to check if something matches a value, we use `expect()`
    -   to assert if something should throw an error, use `expect().to.be.revertedWith()`

    ```

            import { assert, expect } from "chai"
            import { ethers, Contract} from "ethers"

            describe("Contract name", () => {
                beforeEach(async () => {
                    console.log("executes before each test")
                    const contract = await ethers.getContractFactory("Contract")
                    ....
                })

                describe("test component", () => {
                    console.log("testing a specific function/event inside contract")
                    it("unit test description", async () => {

                        console.log("Write unit test here")

                        expect(<actual output>).to.equal(<expected output>)

                        expect(<actual output>).to.be.revertedWith(<error message>)
                    })
                })
            })
    ```

---

## Checking Coverage

Hardhat toolbox includes `solidity-coverage` plugin to measure test coverage in your project.

                yarn hardhat coverage

---

## Gas Reporter

Hardhat toolbox contains `hardhat-gas-reporter` plugin to get metrics of gas used, based on test execution. `REPORT_GAS` environment variable should be set to true in `hardhat-config.ts`

---
