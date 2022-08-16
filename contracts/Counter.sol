//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Counter{

    uint256 private s_counter;

    uint256 immutable i_initialValue;

    // initialize initial value
    constructor(uint256 _initialValue){
        i_initialValue = _initialValue;
        s_counter = i_initialValue;
    }

    /** 
     * @dev get counter value
     */
    function getCounter() public view returns(uint256){
        return s_counter;
    }

    /**
     * @dev set counter value to a specific number
     */
    function setCounter(uint256 _counter) public {
        s_counter = _counter;
    }

    /**
     * @dev resets counter back to initial value
     */
    function resetCounter() public {
        s_counter = i_initialValue;
    }

    /**
     * @dev decreases counter by a fixed number
     */
    function increment(uint256 _increment) public {
        require(_increment > 0, "increment cannot be negative");
        s_counter += _increment;
    }

    /**
     * @dev decreases counter by a fixed number
     */
    function decrement(uint256 _decrement) public {
        require(_decrement > 0, "decrement cannot be negative");
        s_counter -= _decrement;
    }


}