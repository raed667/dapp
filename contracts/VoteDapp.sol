pragma solidity ^0.4.2;

contract VoteDapp {
  
  struct Dog {
    uint voteCount;
    string name;
  }
    
  uint public startTime;
  address public owner;
  Dog[] private candidates;
  
  event DogAdded(address indexed _from, string name);
 
  // Constractor
  function VoteDapp() public {
    owner = msg.sender;
    startTime = now;
  }

  function addCandidate(string _name) public {
    candidates.push(Dog(0, _name));
    DogAdded(msg.sender, _name);
  }

  function submitVote(uint256 index) public {
    candidates[index].voteCount++;
  }

  function getCandidatesCount() public constant returns (uint256 nbrCandidates) {
    return candidates.length;
  }
  
  function getCandidate(uint index) public constant returns(uint, string) {
    return (candidates[index].voteCount, candidates[index].name);
  }
  
  // Modifier, Check if time is up
    modifier isTimeUp() {
        require(now > startTime + 5 minutes);  
        _;
    }
  
  function getWinner() public isTimeUp constant returns (uint, string) {
     uint winnerIndex = 0;
     uint winnerVotes = 0;
     
     for(uint x = 0; x < candidates.length; x++) {
        if (candidates[x].voteCount > winnerVotes) {
            winnerIndex = x;
            winnerVotes = candidates[x].voteCount;
        }
    }
    
    return (candidates[winnerIndex].voteCount,candidates[winnerIndex].name);
  }
}

