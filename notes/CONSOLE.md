# HARDHAT CONSOLE

-   Access built in hardhat console by typing

              $yarn hardhat console

-   You can checkout the hardhat.config.ts contents

                  $config

-   You can get ethers object

                  $ethers

-   anything that has been injected into hardhat runtime environment will be available in global scope

-   you can explicitly get the hre object (hardhat runtime environment) by doing following

                  $const hre = require("hardhat")

-   Hardhat console supports high level `await` statements, eg.

                    $console.log(await ethers.getSigners())
