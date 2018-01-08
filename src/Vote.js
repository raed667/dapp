import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import { Table, Icon } from "antd";

class Vote extends Component {
  constructor(props) {
    super(props);

    this.imgStyles = {
      width: 128
    };

    this.loadDogs = this.loadDogs.bind(this);

    this.state = {
      dogs: [
        {
          key: "1",
          img: "https://i.imgur.com/0ETW6je.jpg",
          name: "John Brown"
        },
        {
          key: "2",
          img: "https://i.imgur.com/JlqlvNu.jpg",
          name: "Jim Green"
        },
        {
          key: "3",
          img: "https://i.imgur.com/6Gjw3TN.jpg",
          name: "Joe Black"
        }
      ]
    };
  }

  columns = [
    {
      title: "Picture",
      dataIndex: "img",
      key: "img",
      render: src => <img style={this.imgStyles} src={src} alt="dog" />
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <a>
            <Icon onClick={() => this.onVoteClick(record)} type="heart" />
          </a>
        </span>
      )
    }
  ];

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTab === "vote") {
      this.loadDogs();
    }
    if (nextProps.dogs.length > 0) {
      this.setState({
        loading: false
      });
    }
  }

  loadDogs() {
    console.log("load dogs");
    this.setState({
      loading: true
    });
  }

  onVoteClick(record) {
    console.log(record);
  }

  render() {
    let display;
    if (this.state.loading) {
      display = <ContentLoader type="bullet-list" />;
    } else {
      display = <Table columns={this.columns} dataSource={this.props.dogs} />;
    }

    return display;
  }
}

export default Vote;
