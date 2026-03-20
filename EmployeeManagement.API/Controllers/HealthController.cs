using System;
using System.Web.Http;

namespace EmployeeManagement.API.Controllers
{
    public class HealthController : ApiController
    {
        // GET: api/health
        [HttpGet]
        [Route("api/health")]
        public IHttpActionResult Get()
        {
            return Ok(new 
            { 
                status = "OK", 
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            });
        }
    }
}
