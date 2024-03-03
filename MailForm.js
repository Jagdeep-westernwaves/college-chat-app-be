import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Row, Col } from "antd";
import axios from "axios";
import { CenterForm } from "../Style/Style";
import { NavLink, useHistory } from "react-router-dom";
const layout = {
  layout: "vertical",
};

const MailForm = () => {
  const history = useHistory();
  const onFinish = (values) => {
    console.log(values);

    axios.post(
      `http://localhost:9000/sendbyform`,

      {
        name: values.name,
        email: values.email,
        subject: values.subject,
        bodydata: values.bodydata,
        mno: values.mno,
      }
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <CenterForm>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <span className="form-heading">Sign In</span>
          </Row>
          <Row>
            <>
              <Col span={24}>
                <Form.Item>
                  <label className="form-Lable">User Name</label>
                </Form.Item>
                <Form.Item name="name" rules={[{ required: true }]}>
                  <Input
                    className="form-Input "
                    placeholder="Enter your Name"
                  />
                </Form.Item>
                <Form.Item name="subject" rules={[{ required: true }]}>
                  <Input className="form-Input " placeholder="Enter Subject" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true }]}>
                  <Input className="form-Input " placeholder="Enter E-mail" />
                </Form.Item>
                <Form.Item name="bodydata" rules={[{ required: true }]}>
                  <Input.TextArea
                    rows={4}
                    className="form-Input "
                    placeholder="Enter Body Data"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="mno" rules={[{ required: true }]}>
                  <Input className="form-Input " placeholder="Enter Mobile" />
                </Form.Item>
              </Col>
            </>
          </Row>
          <Form.Item>
            <Button className="form-button" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </CenterForm>
    </>
  );
};

export default MailForm;
