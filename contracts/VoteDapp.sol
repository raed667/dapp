pragma solidity ^0.4.2;

contract VoteDapp {
  
  struct Dog {
    uint voteCount;
    string name;
  }

  address public owner;
  Dog[] private candidates;
  
  event DogAdded(address indexed _from, string name);
 
  // Constractor
  function VoteDapp() public {
    owner = msg.sender;
  }

  function addCandidate(string _name) public {
    candidates.push(Dog(0, _name));
    DogAdded(msg.sender, _name);
  }

  function getCandidatesCount() public constant returns (uint256 nbrCandidates) {
    return candidates.length;
  }
  
  function getCandidate(uint index) public constant returns(uint, string) {
    return (candidates[index].voteCount, candidates[index].name);
  }
}

