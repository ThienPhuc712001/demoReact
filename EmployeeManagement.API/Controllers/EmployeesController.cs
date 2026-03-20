using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Http.Cors;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repository;

namespace EmployeeManagement.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/employees")]
    public class EmployeesController : ApiController
    {
        private readonly IEmployeeRepository _repository;
           
        public EmployeesController()
        {
            _repository = new EmployeeRepository();
        }

        // GET: api/employees
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var employees = _repository.GetAll();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error fetching employees: " + ex.Message);
                return InternalServerError(new Exception("Failed to fetch employees"));
            }
        }

        // GET: api/employees/:id
        [HttpGet]

        [Route("{id:int}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var employee = _repository.GetById(id);
                if (employee == null)
                {
                    return NotFound();
                    }   
                return Ok(employee);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error fetching employee: " + ex.Message);
                return InternalServerError(new Exception("Failed to fetch employee"));
            }
        }

        // POST: api/employees
        [HttpPost]
        [Route("")]
        [ValidateEmployee]
        public IHttpActionResult Create([FromBody] EmployeeCreateUpdateDto employee)
        {
            try
            {
                var createdEmployee = _repository.Create(employee);
                
                // TODO: Add WebSocket broadcast when implemented
                // WebSocketHandler.Broadcast(new { type = "employee_created", data = createdEmployee });

                return Created($"api/employees/{createdEmployee.Id}", createdEmployee);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error creating employee: " + ex.Message);
                
                // Check for unique constraint violation (SQL error 2627)
                if (ex.InnerException != null && ex.InnerException.Message.Contains("unique constraint"))
                {
                    return Conflict();
                }
                
                return InternalServerError(new Exception("Failed to create employee"));
            }
        }

        // PUT: api/employees/:id
        [HttpPut]
        [Route("{id:int}")]
        [ValidateEmployee]
        public IHttpActionResult Update(int id, [FromBody] EmployeeCreateUpdateDto employee)
        {
            try
            {
                var updatedEmployee = _repository.Update(id, employee);
                if (updatedEmployee == null)
                {
                    return NotFound();
                }

                // TODO: Add WebSocket broadcast when implemented
                // WebSocketHandler.Broadcast(new { type = "employee_updated", data = updatedEmployee });

                return Ok(updatedEmployee);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error updating employee: " + ex.Message);
                return InternalServerError(new Exception("Failed to update employee"));
            }
        }

        // DELETE: api/employees/:id
        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var deleted = _repository.Delete(id);
                if (!deleted)
                {
                    return NotFound();
                }

                // TODO: Add WebSocket broadcast when implemented
                // WebSocketHandler.Broadcast(new { type = "employee_deleted", data = new { id = id } });

                return Ok(new { message = "Employee deleted successfully" });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error deleting employee: " + ex.Message);
                return InternalServerError(new Exception("Failed to delete employee"));
            }
        }
    }

    // Custom validation attribute
    [AttributeUsage(AttributeTargets.Method)]
    public class ValidateEmployeeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var employee = actionContext.ActionArguments["employee"] as EmployeeCreateUpdateDto;
            if (employee == null)
            {
                actionContext.Response = actionContext.Request.CreateResponse(
                    System.Net.HttpStatusCode.BadRequest, "Invalid employee data");
                return;
            }

            // Validate Name
            if (string.IsNullOrWhiteSpace(employee.Name) || employee.Name.Trim().Length < 2)
            {
                actionContext.Response = actionContext.Request.CreateResponse(
                    System.Net.HttpStatusCode.BadRequest, "Name must be at least 2 characters long");
                return;
            }

            // Validate Age
            if (employee.Age < 1 || employee.Age > 100)
            {
                actionContext.Response = actionContext.Request.CreateResponse(
                    System.Net.HttpStatusCode.BadRequest, "Age must be between 1 and 100");
                return;
            }

            // Validate Position
            if (string.IsNullOrWhiteSpace(employee.Position) || employee.Position.Trim().Length < 2)
            {
                actionContext.Response = actionContext.Request.CreateResponse(
                    System.Net.HttpStatusCode.BadRequest, "Position must be at least 2 characters long");
                return;
            }

            base.OnActionExecuting(actionContext);
        }
    }
}
