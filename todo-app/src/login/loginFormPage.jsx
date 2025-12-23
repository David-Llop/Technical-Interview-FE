import {
  PageContainer,
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, message, Tabs } from "antd";
import { useState } from "react";
import { APICreateUser, APILogin } from "../ApiService";
import { useNavigate } from "react-router-dom";
export const LoginFormPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("login");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const submitForm = async (form) => {
    form.validateFields();
    const userName = form.getFieldValue("username");
    const password = form.getFieldValue("password");
    if (!userName || !password) return;
    setLoading(true);
    const shaPassword = await sha256(password);
    if (activeKey === "login") {
      APILogin(userName, shaPassword)
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            if (response.status === 404 || response.status === 401) {
              messageApi.error("User or password incorrect");
            } else {
              messageApi.error("An internal error occured");
            }
            throw new Error("Could not login");
          }
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          navigate("/todos", { state: data.id, replace: true });
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      APICreateUser(userName, shaPassword)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 409) {
              messageApi.error("User already exists");
            } else {
              messageApi.error("An internal error occured");
            }
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          console.log(data);
          console.log(data.id);
          navigate("/todos", { state: data.id, replace: true });
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <PageContainer title="TODO website">
      {contextHolder}
      <ProForm
        layout="horizontal"
        variant="outlined"
        submitter={{
          render: ({ form }) => {
            return (
              <Button
                loading={isLoading}
                key="next"
                type="primary"
                onClick={() => {
                  submitForm(form);
                }}
              >
                {activeKey === "login" ? "Log in" : "Sign up"}
              </Button>
            );
          },
        }}
      >
        <Tabs
          centered
          activeKey={activeKey}
          items={[
            { key: "login", label: "Log in" },
            { key: "signup", label: "Sign up" },
          ]}
          onChange={(key) => setActiveKey(key)}
        />

        <div style={{ marginTop: "32px" }}>
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
            }}
            placeholder={"user"}
            rules={[
              {
                required: true,
                message: "This field is required",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"password"}
            rules={[
              {
                required: true,
                message: "This field is required",
              },
            ]}
          />
        </div>
      </ProForm>
    </PageContainer>
  );
};

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashHex = Array.from(new Uint8Array(hashBuffer)); // Convert ArrayBuffer to hex string.
  const hash = hashHex
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
}
