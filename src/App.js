import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { employeeService } from "./services/api";

const EmployeeManagement = React.memo(() => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên!");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onFinish = useCallback(async (values) => {
    try {
      if (isEditing) {
        await employeeService.updateEmployee(editingId, values);
        message.success("Cập nhật thành công!");
      } else {
        await employeeService.createEmployee(values);
        message.success("Thêm nhân viên thành công!");
      }

      form.resetFields();
      setIsEditing(false);
      setEditingId(null);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      message.error(isEditing ? "Cập nhật thất bại!" : "Thêm nhân viên thất bại!");
      console.error("Error:", error);
    }
  }, [isEditing, editingId, form, fetchEmployees]);

  const handleDelete = useCallback(async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      message.success("Đã xóa!");
      fetchEmployees(); // Refresh the list
    } catch (error) {
      message.error("Xóa thất bại!");
      console.error("Error deleting employee:", error);
    }
  }, [fetchEmployees]);

  const handleEdit = useCallback((record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsEditing(true);
  }, [form]);

  const ActionButtons = React.memo(({ record }) => (
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
  ));

  const columns = useMemo(() => [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    { title: "Chức vụ", dataIndex: "position", key: "position" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => <ActionButtons record={record} />,
    },
  ], [handleEdit, handleDelete]);

  return (
    <Card title="Quản Lý Nhân Viên" style={{ margin: 30 }}>
      <Form
        form={form}
        layout="inline"
        autoComplete="off"
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
          <Input placeholder="Tên" autoComplete="name" />
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
          <InputNumber placeholder="Tuổi" autoComplete="off" />
        </Form.Item>

        {/* POSITION */}
        <Form.Item
          name="position"
          rules={[
            { required: true, message: "Vui lòng nhập chức vụ!" },
            { min: 2, message: "Chức vụ phải ít nhất 2 ký tự!" },
          ]}
        >
          <Input placeholder="Chức vụ" autoComplete="off" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
});

export default EmployeeManagement;