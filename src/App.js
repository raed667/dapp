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

// Contract
const contract = require("truffle-contract");
import VoteDappContract from "../build/contracts/VoteDapp.json";
const voteDapp = contract(VoteDappContract);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: "vote",
      dogs: [],
      accounts: []
    };

    // Contract
    this.voteDapp = contract(VoteDappContract);
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        console.log(results.web3);
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract = () => {
    voteDapp.setProvider(this.state.web3.currentProvider);

    let voteDappInstance; // contract instance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      voteDapp
        .deployed()
        .then(instance => {
          this.setState({
            accounts: accounts
          });
          voteDappInstance = instance;
          return voteDappInstance.getCandidatesCount.call();
        })
        .then(result => {
          const candidateCount = result.toNumber(); // Bignumber js
          console.log(`There are ${candidateCount} candidates`);

          for (let index = 0; index < candidateCount; index++) {
            // Get every candidate
            console.log(`Candidate :${index}`);
            voteDappInstance.getUser.call(index).then(candidate => {
              const dogs = this.state.dogs;

              dogs.push({
                voteCount: candidate[0].toNumber(),
                name: this.state.web3.toUtf8(candidate[1]),
                img: this.state.web3.toUtf8(candidate[2])
              });

              this.setState({
                dogs
              });
            });
          }
        })
        .catch(err => {
          console.warn(err);
        });
    });
  };

  onTabChange = key => {
    this.setState({
      selectedTab: key
    });
  };

  onAddCandidate = (name, img) => {
    let voteDappInstance; // contract instance

    console.log("name ", this.state.web3.toHex(name));
    
    voteDapp
      .deployed()
      .then(instance => {
        console.log("voteDappInstance");
        voteDappInstance = instance;
        return voteDappInstance
          .addCandidate(
            this.state.web3.toHex(name),
            this.state.web3.toHex(img),
            {
              from: this.state.accounts[0]
            }
          )
          .then(result => {
            console.log("added success", result);

            // Events
            for (var i = 0; i < result.logs.length; i++) {
              var log = result.logs[i];

              if (log.event === "DogAdded") {
                console.log(this.state.web3.toUtf8(log.args.name));
                // We found the event!
                break;
              }
            }
          });
      })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.warn(err);
      });
  };

  onAddEventSuccess(index) {
    notification.success({
      message: "Added " + index,
      description: `${index}`
    });
  }

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
          <Vote dogs={this.state.dogs} currentTab={this.state.selectedTab} />
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
            onAdd={this.onAddCandidate}
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
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    );
  }
}

export default App;
