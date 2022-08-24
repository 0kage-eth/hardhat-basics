# DEPLOYING CONTRACTS

## Deploying

-   Even though hardhat does not have an official hardhat-deploy plugin, we can use

                  yarn add --dev hardhat-deploy

-   Add `import @hardhat-dep
-   Creates a `deploy` task - task runs all files in deploy folder

---

## Verifying

-   Verifying a contract means to make source code of contract public along with compiler settings
-   Anyone can compile code and check the generated bytecode with one that is deployed on-chain
-   Create an account and get a API key from etherscan
-   add API key to hardhat.config.ts

```
export default {
  // ...rest of the config...
  etherscan: {
    apiKey: "ABCDE12345ABCDE12345ABCDE123456789",
  },
};
```

-   You can verify by putting in following code

                  yarn hardhat verify --network rinkeby arg1 arg2