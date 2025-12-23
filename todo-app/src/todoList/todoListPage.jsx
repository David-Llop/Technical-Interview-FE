import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APICreateTodo, APIGetTodos, APISetTodoAsDone } from "../ApiService";
import { Flex, Typography, Tag, Button, Form, Space, message } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const TodoListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(() => {
    setLoading(true);
    APIGetTodos(userId)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          messageApi.error("An internal error occured");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [userId, messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const taskDone = (taskId) => {
    APISetTodoAsDone(userId, taskId)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            messageApi.error("Todo not found");
          } else {
            messageApi.error("An internal error occured");
          }
          throw new Error("Network response was not ok");
        }
      })
      .then(() => fetchData());
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (value, { isCompleted }) => (
        <Flex gap="small" align="center" wrap>
          <Text strong>{value}</Text>
          <Tag color={isCompleted ? "green" : "red"}>
            {isCompleted ? "Done" : "TODO"}
          </Tag>
        </Flex>
      ),
    },
    {
        title: "Created",
        dataIndex: "created",
        key: "created",
        render: (value) => (
            <Text>{value.replace('T', ' ').split('.')[0].slice(0, -3)}</Text>
        )
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => taskDone(record.id)}>
          Mark as done
        </Button>
      ),
    },
  ];

  const NewTaskForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setLoading] = useState(false);
    const createTask = (title, description) => {
      setLoading(true);
      APICreateTodo(userId, title, description)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then(() => {
          fetchData();
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          message.error(<p>Unable to create task</p>);
        });
    };
    return (
      <ModalForm
        title={"New task to do"}
        form={form}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            New
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
          cancelText: "Cancel",
          okText: "Create",
          okButtonProps: {
            loading: isLoading,
          },
        }}
        onFinish={async (values) => {
          form.validateFields();
          if (!values.title || !values.description) {
            return false;
          }
          createTask(values.title, values.description);
          return true; // close modal
        }}
      >
        <ProFormText
          name={"title"}
          label={"Title"}
          placeholder={""}
          required={true}
        ></ProFormText>
        <ProFormTextArea
          name={"description"}
          label={"Description"}
          placeholder={""}
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        ></ProFormTextArea>
      </ModalForm>
    );
  };

  return (
    <PageContainer>
      {contextHolder}
      <Space>
        <Button onClick={() => navigate("/", { replace: true })}>
          <UserOutlined />
          Log out
        </Button>
      </Space>
      <ProTable
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={columns}
        search={false}
        options={false}
        toolBarRender={() => {
          return <NewTaskForm />;
        }}
        locale={{emptyText:"No data"} }
      ></ProTable>
    </PageContainer>
  );
};
