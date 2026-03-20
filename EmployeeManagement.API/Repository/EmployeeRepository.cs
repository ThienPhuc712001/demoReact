using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        public IEnumerable<Employee> GetAll()
        {
            using (var connection = DbFactory.CreateConnection())
            {
                var sql = @"
                    SELECT id, name, age, position
                    FROM Employees
                    ORDER BY id
                ";
                return connection.Query<Employee>(sql).ToList();
            }
        }

        public Employee GetById(int id)
        {
            using (var connection = DbFactory.CreateConnection())
            {
                var sql = @"
                    SELECT id, name, age, position
                    FROM Employees
                    WHERE id = @Id
                ";
                return connection.QueryFirstOrDefault<Employee>(sql, new { Id = id });
            }
        }

        public Employee Create(EmployeeCreateUpdateDto employeeDto)
        {
            using (var connection = DbFactory.CreateConnection())
            {
                var sql = @"
                    INSERT INTO Employees (name, age, position)
                    OUTPUT INSERTED.id, INSERTED.name, INSERTED.age, INSERTED.position
                    VALUES (@Name, @Age, @Position)
                ";
                return connection.QueryFirstOrDefault<Employee>(sql, new
                {
                    Name = employeeDto.Name.Trim(),
                    Age = employeeDto.Age,
                    Position = employeeDto.Position.Trim()
                });
            }
        }

        public Employee Update(int id, EmployeeCreateUpdateDto employeeDto)
        {
            using (var connection = DbFactory.CreateConnection())
            {
                // Update without OUTPUT clause (to work with triggers)
                var updateSql = @"
                    UPDATE Employees
                    SET name = @Name, age = @Age, position = @Position
                    WHERE id = @Id
                ";

                var rowsAffected = connection.Execute(updateSql, new
                {
                    Id = id,
                    Name = employeeDto.Name.Trim(),
                    Age = employeeDto.Age,
                    Position = employeeDto.Position.Trim()
                });

                if (rowsAffected == 0)
                {
                    return null;
                }

                // Fetch updated employee data
                var selectSql = @"
                    SELECT id, name, age, position
                    FROM Employees
                    WHERE id = @Id
                ";

                return connection.QueryFirstOrDefault<Employee>(selectSql, new { Id = id });
            }
        }

        public bool Delete(int id)
        {
            using (var connection = DbFactory.CreateConnection())
            {
                var sql = @"
                    DELETE FROM Employees
                    OUTPUT DELETED.id
                    WHERE id = @Id
                ";
                var deletedId = connection.QueryFirstOrDefault<int?>(sql, new { Id = id });
                return deletedId.HasValue;
            }
        }
    }
}
