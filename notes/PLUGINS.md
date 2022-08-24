# PLUGINS

## Intro

-   Plugins are bits of reusable configuration

-   Anything you can do in a plugin, you can do by writing it in `hardhat.config.ts` file

-   You can do following using plugins

    -   Extend functionality of HRE
    -   Add new tasks
    -   Modify behavior of existing tasks

-   `solidity-coverage`, `hardhat-ethers-deploy` are some examples of plugins

## Extending HRE

-   One way of creating a plugin is to extend HRE - this would mean that more features are accessible across entire project (eg. tasks, scripts etc)

-   `extendEnvironment()` function allows us to add extension functions to existing queue.

-   It receives one paramater, a callback that will be executed after HRE is initialized

-   We can add the following to `hardhat.config.ts`. Note that the 'hi' is unrecognized in HRE object & you get an error -> to extend HRE runtime variables, follow the procedure in this [example](https://github.com/NomicFoundation/hardhat-ts-plugin-boilerplate/tree/master/src)

```
extendEnvironment((hre)=> {
    hre.hi="Hey there. Welcome to HRE!"
})
```

-   Once above script is executed in `hardhat.config.ts`, we can define a task around this also in config file

```
    task("envtest", (args, hre)=>{
        console.log(`hre.hi ${args[0]}`)
    })
```
