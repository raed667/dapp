import React, { Component } from "react";

import { Row, Col, Button } from "antd";

class Result extends Component {
  render() {
    let winnerPanel = <span />;

    if (this.props.winner) {
      winnerPanel = (
        <div>
          <img width="100%" alt="winner" src="http://audneal.typepad.com/.a/6a010534aaa6ea970c0168e8d49fe3970c-pi" />{" "}
          this.props.winner.vote + " | " + this.props.winner.name
        </div>
      );
    }

    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={8}>
            {winnerPanel}
            <br />
            <Button onClick={this.props.onCheckResult} type="primary">
              Check results
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Result;
