-- Chạy script này trong SSMS hoặc Azure Data Studio (kết nối bằng Windows Authentication)
-- Mục đích: tạo database EmployeeDB, bảng Employees, và user đăng nhập SQL cho app

-- 1. Tạo database (nếu chưa có)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EmployeeDB')
BEGIN
    CREATE DATABASE EmployeeDB;
END
GO

USE EmployeeDB;
GO

-- 2. Tạo bảng Employees (nếu chưa có)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
BEGIN
    CREATE TABLE Employees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        age INT NOT NULL,
        position NVARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 3. Tạo login SQL (user đăng nhập cho app) - mật khẩu: EmployeeApp123!
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'employee_app')
BEGIN
    CREATE LOGIN employee_app WITH PASSWORD = 'EmployeeApp123!';
END
GO

-- 4. Tạo user trong database EmployeeDB và cấp quyền
USE EmployeeDB;
GO
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'employee_app')
BEGIN
    CREATE USER employee_app FOR LOGIN employee_app;
    ALTER ROLE db_owner ADD MEMBER employee_app;
END
GO

-- PRINT 'Done. Use DB_USER=employee_app and DB_PASSWORD=EmployeeApp123! in .env';
