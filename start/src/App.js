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
const voteDapp = contract(VoteDappContract);

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

  /**
   * Returns the vote contract instance
   *
   * Helper method
   */
  getContractInstance = async web3 => {
    this.voteDapp.setProvider(web3.currentProvider);
    const instance = await this.voteDapp.deployed();
    return instance;
  };

  getCandidatesList = async web3 => {
    /**
     * Get list of all candidates
     * TODO
     *
     * 1- get current account (user): web3.eth.accounts[0]
     * 2- get contract instance: await this.getContractInstance(web3)
     * 3- call contract method 'getCandidatesCount': getCandidatesCount.call()
     * 4- loop over candidates and get them all: getCandidate.call(index)
     * 5- add the to local "state" candidates (use addCandidateToList)
     */
  };

  onAddCandidate = async (name, web3) => {
    /**
     * Add new candidate to contract
     *
     * 1- Convert the name from ASCII to HEX: web3.fromAscii
     * 2- get current account (user) web3.eth.accounts[0]
     * 3- get contract instance: await this.getContractInstance(web3)
     * 4- call contract method 'addCandidate': addCandidate(name, {from: account})
     * 5- check for Event "CandidateAdded" in logs
     * 6- display success message: onAddEventSuccess: web3.toUtf8
     */
  };

  onVote = async (candidate, web3) => {
    /**
     *  Vote on candidate
     *
     * 1- get contract instance: await this.getContractInstance(web3)
     * 2- get current account (user) web3.eth.accounts[0]
     * 3- call contract method 'submitVote': submitVote(index, {from: account})
     * 4- Display success message 'onVoteSuccess'
     */
  };

  onCheckResult = async web3 => {
    /**
     *  Gets winner
     *
     * 1- get contract instance: await this.getContractInstance(web3)
     * 3- call contract method 'getWinner': getWinner.call()
     * 4- Display winner name and vote count'displayResults'
     */
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
            submitVote={this.onVote}
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

  /**
   * Helper functions
   */
  addCandidateToList = (index, voteCount, name) => {
    const candidates = this.state.candidates;

    candidates.push({
      index,
      voteCount,
      name
    });

    this.setState({
      candidates
    });
  };

  componentWillMount() {
    getWeb3
      .then(results => {
        if (results !== null) {
          console.log(results.web3);
          this.setState({
            web3: results.web3
          });
          // Call contract once web3 provided.
          this.voteDapp.setProvider(results.web3.currentProvider);
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

  onAddEventSuccess = index => {
    notification.success({
      message: "Added: " + index,
      description: `${index}`
    });
  };

  onVoteSuccess = () => {
    notification.success({
      message: "Voted"
    });
  };

  displayResults = result => {
    const winnerVote = result[0];
    const winnerName = result[1];
    this.setState({
      winner: {
        vote: winnerVote.toNumber(),
        name: this.state.web3.toUtf8(winnerName)
      }
    });
  };

  onTabChange = key => {
    this.setState({
      selectedTab: key
    });
    if (key === "vote") {
      this.setState({
        candidates: []
      });
      this.getCandidatesList(this.state.web3);
    }
  };
}

export default App;
