using System;
using System.Web;
using System.Web.Http;
using EmployeeManagement.API.App_Start;

namespace EmployeeManagement.API
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            // Configure Web API
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            // Handle CORS preflight requests
            if (Request.HttpMethod == "OPTIONS")
            {
                Response.StatusCode = 200;
                Response.End();
            }
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();
            System.Diagnostics.Debug.WriteLine("Unhandled error: " + exception.Message);
        }
    }
}
