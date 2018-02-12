import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import { Table, Icon, notification } from "antd";

class Vote extends Component {
  constructor(props) {
    super(props);


    this.state = {
      loading: false
    };
  }

  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span >
          <a>
            <Icon onClick={() => this.onVoteClick(record)} type="heart" />
          </a>
        </span>
      )
    }
  ];

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTab === "vote") {
      this.loadCandidates();
    }
    if (nextProps.candidates.length > 0) {
      this.setState({
        loading: false
      });
    }
  }

  loadCandidates = () => {
    console.log("load candidates...");
    this.setState({
      loading: true
    });
  }

  onVoteClick  = (record) => {
    notification.info({
      message: "Voting...",
      description: `${record.name}`
    });
    console.log(record);
    this.props.submitVote(record);    
  }

  render() {
    let display;
    if (this.state.loading) {
      display = <ContentLoader type="bullet-list" />;
    } else {
      display = <Table rowKey="name" columns={this.columns} dataSource={this.props.candidates} />;
    }

    return display;
  }
}

export default Vote;
