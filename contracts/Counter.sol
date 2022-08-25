//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Counter{

    uint256 private s_counter;

    uint256 immutable i_initialValue;
    uint256 immutable i_min;
    uint256 immutable i_max;

    event SetCounter(uint256 ctrValue);
    event Increment(uint256 increment, uint256 ctrValue);
    event Decrement(uint256 decrement, uint256 ctrValue);
    event ResetCounter();

    error Counter__OutofRange(uint256 min, uint256 max, uint256 ctrValue);


    // initialize initial value
    constructor(uint256 _initialValue, uint256 _imin, uint256 _imax){
        i_initialValue = _initialValue;
        i_min = _imin;
        i_max = _imax;
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
    function setCounter(uint256 _counter) public InRange {
        s_counter = _counter;

        emit SetCounter(s_counter);
    }

    /**
     * @dev resets counter back to initial value
     */
    function resetCounter() public {
        s_counter = i_initialValue;

        emit ResetCounter();
    }

    /**
     * @dev decreases counter by a fixed number
     */
    function increment(uint256 _increment) public InRange {
        require(_increment > 0, "increment has to be positive");
        s_counter += _increment;

        emit Increment(_increment, s_counter);
    }

    /**
     * @dev decreases counter by a fixed number
     * @dev new number generated should be in range and should not be even
     * @dev put both modifiers InRange/CheckEven as part of function signature
     */
    function decrement(uint256 _decrement) public InRange CheckEven{
        require(_decrement > 0, "decrement cannot be negative");
        s_counter -= _decrement;

        emit Decrement(_decrement, s_counter);
    }

    /**
     * @dev check if counter is in range using InRange modifier
     * @dev notice that first function runs and then once s_counter is updated, modifier checks if value is to be reverted
     */

    modifier InRange(){
        _;        
        if(s_counter< i_min || s_counter > i_max)
        {
            revert Counter__OutofRange(i_min, i_max, s_counter);
        }
    }

    /**
     * @dev modifier to check if even number is allowed
     */
    modifier CheckEven(){
        _;
        require(s_counter % 2 != 0);
    }


}