# TASKS AND SCRIPTS

-   At its core, hardhat is a task runner that automates development workflow
-   it comes with some built-in tasks such as `compile` and `test`
-   But the cooler feature is that we can create our own tasks

## Task

Copy code in [taskExample.ts](../utils/taskExample.ts) and paste it inside of hardhat.config.ts

Once done, come back to terminal and type

                $yarn hardhat

You will see that 'print-account' comes up as one of available tasks

Type following on terminal to execute task

                $yarn hardhat print-account

# Script

Same code above can be converted to script

Checkout code in [print-accounts.ts](../scripts/print-accounts.ts)

You can run this code by typing

                $yarn hardhat run scripts/print-accounts.ts

Notice all the account addresses printed on console.

Unlike in the task definition, we didn't need to specially import `ethers` into our script file. That is because hardhat automatically makes Hardhat runtime environment functions available in script

## Choosing between tasks and scripts

-   if workflow automation needs no parameters, consider scripting it
-   if workflow needs parameter input, consider writing a task

## Writing standalone scripts in hardhat

<To do>
