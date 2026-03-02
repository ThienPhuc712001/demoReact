import React, { useState } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Nguyễn Văn A", age: 25, position: "Developer" },
    { id: 2, name: "Trần Thị B", age: 28, position: "Tester" },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    position: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "age") {
    if (value < 0) return; // không cho nhập số âm
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

  // Add employee
  const handleAdd = () => {
  if (!formData.name || !formData.age || !formData.position) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const maxId =
    employees.length > 0
      ? Math.max(...employees.map((emp) => emp.id))
      : 0;

  const newEmployee = {
    id: maxId + 1,
    name: formData.name,
    age: Number(formData.age),
    position: formData.position,
  };

  setEmployees([...employees, newEmployee]);
  resetForm();
};

  // Delete employee
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa?");
    if (confirmDelete) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setFormData(employee);
    setIsEditing(true);
  };

  // Update employee
  const handleUpdate = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === formData.id ? formData : emp
      )
    );
    resetForm();
    setIsEditing(false);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      age: "",
      position: "",
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Quản Lý Nhân Viên (React Demo)</h2>
    
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Tên"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Tuổi"
          value={formData.age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Chức vụ"
          value={formData.position}
          onChange={handleChange}
        />

        {isEditing ? (
          <button onClick={handleUpdate}>Cập nhật</button>
        ) : (
          <button onClick={handleAdd}>Thêm</button>
        )}
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Tuổi</th>
            <th>Chức vụ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>{emp.position}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Sửa</button>
                <button onClick={() => handleDelete(emp.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;