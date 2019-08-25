pragma solidity ^0.5.0;

contract Archipel {

    address private _leader;
    
    event LeaderChanged(address indexed previousLeader, address indexed newLeader);

    /**
     * @dev take  leadership for validate in the federation
     */
    function setLeader(address _reportLeader) public {
        require(
            _leader == address(0) || ( _leader != address(0) && _reportLeader == _leader ),
            "Reported Leader do not match the active one."
        );
        require(_leader != msg.sender,  "You are already the leader.");
        address previousLeader = _leader;
        address newLeader = msg.sender;
        _leader = newLeader;
        emit LeaderChanged(previousLeader, newLeader);
    }

    /**
     * @dev Returns the address of the current leader.
     */
    function leader() public view returns (address) {
        return _leader;
    }

}
