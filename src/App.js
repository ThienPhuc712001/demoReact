import React, { useState } from "react";
import {
  Button,
  Input,
  Table,
  Space,
  Popconfirm,
  Card,
  message,
  Form,
  InputNumber,
} from "antd";

function App() {
  const [form] = Form.useForm();

  const [employees, setEmployees] = useState([
    { id: 1, name: "Nguyễn Văn A", age: 25, position: "Developer" },
    { id: 2, name: "Trần Thị B", age: 28, position: "Tester" },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const onFinish = (values) => {
    if (isEditing) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingId ? { ...values, id: editingId } : emp
        )
      );
      message.success("Cập nhật thành công!");
    } else {
      const maxId =
        employees.length > 0
          ? Math.max(...employees.map((emp) => emp.id))
          : 0;

      setEmployees([...employees, { ...values, id: maxId + 1 }]);
      message.success("Thêm nhân viên thành công!");
    }

    form.resetFields();
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    message.success("Đã xóa!");
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsEditing(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên", dataIndex: "name" },
    { title: "Tuổi", dataIndex: "age" },
    { title: "Chức vụ", dataIndex: "position" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản Lý Nhân Viên (Ant Design)" style={{ margin: 30 }}>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        style={{ marginBottom: 20 }}
      >
        {/* NAME */}
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên!" },
            {
              pattern: /^[A-Za-zÀ-ỹ\s]+$/,
              message: "Tên không được chứa số hoặc ký tự đặc biệt!",
            },
          ]}
        >
          <Input placeholder="Tên" />
        </Form.Item>

        {/* AGE */}
        <Form.Item
          name="age"
          rules={[
            { required: true, message: "Vui lòng nhập tuổi!" },
            {
              type: "number",
              min: 1,
              max: 100,
              message: "Tuổi phải từ 1 đến 100!",
            },
          ]}
        >
          <InputNumber placeholder="Tuổi" />
        </Form.Item>

        {/* POSITION */}
        <Form.Item
          name="position"
          rules={[
            { required: true, message: "Vui lòng nhập chức vụ!" },
            { min: 2, message: "Chức vụ phải ít nhất 2 ký tự!" },
          ]}
        >
          <Input placeholder="Chức vụ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={employees} columns={columns} rowKey="id" />
    </Card>
  );
}

export default App;