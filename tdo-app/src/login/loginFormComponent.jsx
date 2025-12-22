import {
  PageContainer,
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { APILogin } from "../ApiService";
export const LoginFormComponent = () => {
  const [isLoading, setLoading] = useState(false);

  const submitForm = async (form) => {
    form.validateFields();
    const userName = form.getFieldValue("username");
    const password = form.getFieldValue("password");
    if (!userName || !password) return;
    setLoading(true);
    const shaPassword = await sha256(password);
    APILogin(userName, shaPassword)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error))
      .finally(setLoading(false));
  };

  return (
    <PageContainer title="TODO website">
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
                Log In
              </Button>
            );
          },
        }}
      >
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
