using System;

namespace EmployeeManagement.API.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public string Position { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class EmployeeCreateUpdateDto
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string Position { get; set; }
    }
}
