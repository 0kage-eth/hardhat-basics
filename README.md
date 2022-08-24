# HARDHAT BASICS

In this project, I setup a hardhat environment and play around with key features provided off-the-shelf by hardhat

I discuss

    - Setting up
    - Compiling contracts
    - Testing contracts
    - Deploying contracts
    - Writing scripts and tasks
    - HRE
    - Compilation artificats
    - Plugins
    - Other hardhat components

---






***








## PLUGINS

### Hardhat-network-helper

Hardhat network helper plugin contains a bunch of functions that makes testing easier. Some of the important ones are


- `time` - We can manipulate time in testing and change timestamp of blocks by going into future by using this 


- `fixtures` - fixtures help in preventing repeated contract deployments before running tests

    - fixture is a function that setups chain to a desired state
    - `loadFixture` - first time this is called, fixture is executed
    - second time, instead of calling the fixture again, `loadFixture` sets up the state at the same point where it was called the first time
    - basically it does an undo to all state changes after fixture was set first time - much faster 


