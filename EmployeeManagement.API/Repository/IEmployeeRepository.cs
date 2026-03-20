using System.Collections.Generic;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repository
{
    public interface IEmployeeRepository
    {
        IEnumerable<Employee> GetAll();
        Employee GetById(int id);
        Employee Create(EmployeeCreateUpdateDto employee);
        Employee Update(int id, EmployeeCreateUpdateDto employee);
        bool Delete(int id);
    }
}
