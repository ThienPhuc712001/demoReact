-- Employee Management Database Schema for SQL Server
-- This script creates the necessary database and table structure for the employee management system

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EmployeeDB')
BEGIN
    CREATE DATABASE EmployeeDB;
    PRINT 'Database EmployeeDB created successfully';
END
ELSE
BEGIN
    PRINT 'Database EmployeeDB already exists';
END

GO

-- Use the EmployeeDB database
USE EmployeeDB;
GO

-- Create Employees table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
BEGIN
    CREATE TABLE Employees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        age INT NOT NULL CHECK (age >= 1 AND age <= 100),
        position NVARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table Employees created successfully';
END
ELSE
BEGIN
    PRINT 'Table Employees already exists';
END

GO

-- Create a trigger to automatically update the updated_at field
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_Employees_Update')
BEGIN
    DROP TRIGGER trg_Employees_Update;
    PRINT 'Existing trigger trg_Employees_Update dropped';
END
GO

CREATE TRIGGER trg_Employees_Update
ON Employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Employees
    SET updated_at = GETDATE()
    FROM Employees e
    INNER JOIN inserted i ON e.id = i.id;
END
PRINT 'Trigger trg_Employees_Update created successfully';
GO

-- Insert sample data
IF NOT EXISTS (SELECT 1 FROM Employees)
BEGIN
    INSERT INTO Employees (name, age, position) VALUES
    ('John Doe', 30, 'Software Developer'),
    ('Jane Smith', 28, 'Project Manager'),
    ('Mike Johnson', 35, 'Team Lead'),
    ('Sarah Williams', 32, 'UX Designer'),
    ('David Brown', 45, 'Department Head');
    
    PRINT 'Sample data inserted successfully';
END
ELSE
BEGIN
    PRINT 'Employees table already contains data';
END

GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Employees_Name')
BEGIN
    CREATE INDEX IX_Employees_Name ON Employees(name);
    PRINT 'Index IX_Employees_Name created successfully';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Employees_Position')
BEGIN
    CREATE INDEX IX_Employees_Position ON Employees(position);
    PRINT 'Index IX_Employees_Position created successfully';
END

GO

PRINT 'Database setup completed successfully';
PRINT 'You can now use the EmployeeDB database with the Employees table';