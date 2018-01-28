import React, { Component } from "react";

import { Form, Icon, Input, Button, notification } from "antd";
const FormItem = Form.Item;

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.onAddNew(values.name);
      }
    });
  }

  onAddNew(name) {
    notification.success({
      message: "Notification",
      description: `${name}`
    });
    this.props.onAdd(name);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Please input a name!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Name"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const AddForm = Form.create()(Add);

export default AddForm;
