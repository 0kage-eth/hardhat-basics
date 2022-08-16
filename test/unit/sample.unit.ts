import { assert, expect } from "chai"
import { ethers } from "ethers"

describe("Contract name", () => {
    beforeEach(async () => {
        console.log("executes before each test")
    })

    describe("test component", () => {
        console.log("testing a specific function/event inside contract")
        it("unit test description", async () => {
            console.log("Write unit test here")
        })
    })
})
