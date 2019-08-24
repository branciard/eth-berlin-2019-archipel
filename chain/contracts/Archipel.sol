pragma solidity ^0.5.0;

contract Archipel {

    address private _leader;
    
    event LeadershipChanged(address indexed previousLeader, address indexed newLeader);

    /**
     * @dev take  leadership for validate in the federation
     */
    function setLeader() public {
        if ( _leader != msg.sender ) {
            address oldLeader = _leader;
            address newLeader = msg.sender;
            _leader = newLeader;
            emit LeadershipChanged(oldLeader,newLeader);
        }
    }

    /**
     * @dev Returns the address of the current leader.
     */
    function leader() public view returns (address) {
        return _leader;
    }

}
