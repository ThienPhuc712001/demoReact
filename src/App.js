import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  fetchEmployeesRequest,
  createEmployeeRequest,
  updateEmployeeRequest,
  deleteEmployeeRequest,
  setEditingEmployee,
  clearEditingEmployee,
  websocketConnect,
  websocketDisconnect
} from "./store/actions";
import websocketService from "./services/websocket";

const EmployeeManagement = React.memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const { employees, loading, isEditing, editingEmployee } = useSelector(state => state.employee);

  // Fetch employees on component mount and setup WebSocket
  useEffect(() => {
    dispatch(fetchEmployeesRequest());
    dispatch(websocketConnect());
    
    // Subscribe to WebSocket events
    const unsubscribeCreated = websocketService.subscribe('employee_created', (data) => {
      message.success('Nhân viên mới đã được thêm!');
    });
    
    const unsubscribeUpdated = websocketService.subscribe('employee_updated', (data) => {
      message.success('Thông tin nhân viên đã được cập nhật!');
    });
    
    const unsubscribeDeleted = websocketService.subscribe('employee_deleted', (data) => {
      message.success('Nhân viên đã được xóa!');
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      dispatch(websocketDisconnect());
    };
  }, [dispatch]);

  const onFinish = useCallback((values) => {
    
    if (isEditing && editingEmployee) {
      dispatch(updateEmployeeRequest(editingEmployee.id, values));
      message.success("Cập nhật thành công!");
    } else {
      dispatch(createEmployeeRequest(values));
      message.success("Thêm nhân viên thành công!");
    }

    form.resetFields();
    dispatch(clearEditingEmployee());
  }, [isEditing, editingEmployee, form, dispatch]);

  const handleDelete = useCallback((id) => {
    dispatch(deleteEmployeeRequest(id));
    message.success("Đã xóa!");
  }, [dispatch]);

  const handleEdit = useCallback((record) => {
    form.setFieldsValue(record);
    dispatch(setEditingEmployee(record));
  }, [form, dispatch]);

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