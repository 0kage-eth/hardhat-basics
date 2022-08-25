# HARDHAT-CHAI-MATCHERS

## Installation and Usage

-   Ethereum specific capabilities to chai - assertion library used to test contracts
-   For installation

```
    yarn add --dev @nomicfoundation/hardhat-chai-matchers
```

-   Add `require("@nomicfoundation/hardhat-chai-matchers")` to hardhat.config.js to start using

## Use case

**Events**

-   Emission of events is important to test in smart contracts - event logs are critical for a good UX on front end
-   To test if a particular event is correctly emitted, we use chai-matchers
-   To detect a event with name 'E' in a contract 'C' we write

```
    await expect(C.call()).to.emit(C, 'E')
```

contract would look something like this..

```
    contract C{
        event E();

        function call() public{
            emit E();
        }
    }
```

-   Note that `await` is required before an `expect(...).to.emit(...)` -> verification requires retrieval of logs from Ethereum node, which is an asynchornous operation. Without await, test may run to completion before ethereum transaction completes.

-   Note that the first argument to emit is the contract that emits the event - if a contract calls another contract that emits an event - to capture that event, argument for emit should be inner contract

**Event with Arguments**

-   Solidity events can contain arguments - you can assert presence of certain argument in. the event that was emitted
-   For eg, to assert an event emits an unsigned integer value

```
    await expect(C.call()).to.emit(C, "E").withArgs(3)
```

-   Sometimes, we only want to check one value in event emissions arguments while we can permit any value for second argument. In such a case we write

```
    await expect(C.call()).to.emit(C, "E").withArgs(anyValue, 3)
```

In above example, we only want to know second argument emitted by event is 3. First argument can be anything - we use `anyValue` to indicate the first argument does not matter

-   `anyValue` is a predicate - predicates are functions that when used, indicate whether value should be considered successfully matched. In this case, `anyValue` is just `() => true`. Package also provides `anyUint`

-   We can create our own predicate as follows

```
    const isEven = (x: BigNumber) : boolean =>{

        return x.mod(2).isZero()
    }

    await expect(C.call()).to.emit(C, "E").withArgs(isEven)
```

Refer to [Counter.unit.ts](../test/unit/Counter.unit.ts) for examples on this

**Reverts**

-   We can write tests to assert if a function reverts with an error

-   Simple revert - to check if there is a revert, we can simply

```
    await expect(C.call()).to.be.reverted
```

-   If a function needs to be asserted that it has not reverted, we do

```
    await expect(C.call()).not.to.be.reverted
```

-   If a function reverts with an error message, we can check if that error is thrown by using `revertedWith`

```
    await expect(C.call()).to.be.revertedWith("Custom error message")
```

-   Conversely, we can check if error message is not reverted with

```
    await expect(C.call()).not.to.be.revertedWith("Custom error message")
```

-   Additionally there is a provision to check for custom errors

```
    await expect(C.call()).to.be.revertedWithCustomErro(C, "custom error")
```

-   Just as with events, first argument specifies Contract => if we are expecting error for inner contract, that contract's name should go into the args

-   Just as events, we can pass args into custom errors, which can be caught similarly using `withArgs()` and specifying args

-   Just as events, we can use custom predicate such as `anyValue`, `anyUint` or make our own predicate

-   We can also assert that a call is reverted without an error data (no reason, no panic mode, no custom error)

```
    await expect(C.call()).to.be.revertedWithoutReason()
```

-   We can assert if a call returns a specific PANIC CODE (Panic code here refers to cases such as division by zero where compiler throws a panic instead of error)

```
    const {PANIC_CODES} = require('@nomicfoundation/hardhat-chai-matchers/panic')

    await expect(C.call()).to.be.revertedWithPanic(PANIC_CODES.DIVISION_BY_ZERO)


    await expect (C.noPanicCall()).not.to.be.revertedWithPanic(PANIC_CODES.DIVISION_BY_ZERO)

    await expect(C.call()).to.be.revertedWithPanic() // this checks if any panic code matches, since we din't provide any
    // specific panic coce
```

Refer to [Counter.unit.ts](../test/unit/Counter.unit.ts) for examples on this

** Big Numbers**
