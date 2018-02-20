import React, { Component } from "react";

// UI
import { Tabs, Icon, notification } from "antd";
const TabPane = Tabs.TabPane;
import "antd/dist/antd.css";

// Web3
import getWeb3 from "./utils/getWeb3";

// Componenets
import Vote from "./Vote";
import Add from "./Add";
import Result from "./Result";

// Contract
const contract = require("truffle-contract");
import VoteDappContract from "../build/contracts/VoteDapp.json";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: "vote",
      candidates: [],
      accounts: []
    };

    // Contract
    this.voteDapp = contract(VoteDappContract);
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        if (results !== null) {
          console.log(results.web3);
          this.setState({
            web3: results.web3
          });
          this.voteDapp.setProvider(results.web3.currentProvider);

          // Call contract once web3 provided.
          this.getCandidatesList(this.state.web3);
        } else {
          throw Error("web3 error");
        }
      })
      .catch(e => {
        notification.error({
          message: "ERROR",
          duration: 0,
          description: `${e}`
        });
      });
  }

  getContractInstance = async web3 => {
    this.voteDapp.setProvider(web3.currentProvider);
    const instance = await this.voteDapp.deployed();
    return instance;
  };

  getCandidatesList = async web3 => {
    const contract = await this.getContractInstance(web3);

    const candidateCount = await contract.getCandidatesCount.call();
    console.log(`There are ${candidateCount.toNumber()} candidates`);

    for (let index = 0; index < candidateCount.toNumber(); index++) {
      const candidate = await contract.getCandidate.call(index);

      const candidates = this.state.candidates;

      candidates.push({
        index,
        voteCount: candidate[0].toNumber(),
        name: web3.toUtf8(candidate[1])
      });

      this.setState({
        candidates
      });
    }
  };

  onAddCandidate = async (name, web3) => {
    const nameHex = this.state.web3.fromAscii(name);
    console.log("Name", nameHex, this.state.web3.toUtf8(nameHex));

    const contract = await this.getContractInstance(web3);

    const result = await contract.addCandidate(nameHex, {
      from: web3.eth.accounts[0]
    });

    console.log("Added success", result);

    // Events
    for (var i = 0; i < result.logs.length; i++) {
      var log = result.logs[i];

      if (log.event === "CandidateAdded") {
        // We found the event!
        console.log(this.state.web3.toUtf8(log.args.name));
        this.onAddEventSuccess(this.state.web3.toUtf8(log.args.name));
        break;
      }
    }
  };

  onAddEventSuccess(index) {
    notification.success({
      message: "Added: " + index,
      description: `${index}`
    });
  }

  onVoteSuccess = () => {
    notification.success({
      message: "Voted"
    });
  };

  onVote = async (candidate, web3) => {
    console.log(candidate);

    const contract = await this.getContractInstance(web3);
    const result = await contract.submitVote(candidate.index, {
      from: web3.eth.accounts[0]
    });
    console.log("Vote success", result);
    this.onVoteSuccess();
  };

  onCheckResultSuccess = result => {
    const winnerVote = result[0];
    const winnerName = result[1];
    this.setState({
      winner: {
        vote: winnerVote.toNumber(),
        name: this.state.web3.toUtf8(winnerName)
      }
    });
  };

  onCheckResult = async web3 => {
    const contract = await this.getContractInstance(web3);
    const result = await contract.getWinner.call();
    this.onCheckResultSuccess(result);
  };

  onTabChange = key => {
    this.setState({
      selectedTab: key
    });
    if (key === "vote") {
      // empty list
      this.setState({
        candidates: []
      });

      this.getCandidatesList(this.state.web3);
    }
  };

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
        <TabPane
          tab={
            <span>
              <Icon type="home" /> Vote
            </span>
          }
          key="vote"
        >
          <Vote
            candidates={this.state.candidates}
            currentTab={this.state.selectedTab}
            submitVote={val => this.onVote(val, this.state.web3)}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="rocket" /> Add
            </span>
          }
          key="add"
        >
          <Add
            onAdd={value => this.onAddCandidate(value, this.state.web3)}
            currentTab={this.state.selectedTab}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="hourglass" /> Results
            </span>
          }
          key="results"
        >
          <Result
            winner={this.state.winner}
            onCheckResult={() => this.onCheckResult(this.state.web3)}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default App;
