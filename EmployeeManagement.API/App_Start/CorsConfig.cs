using System.Configuration;

namespace EmployeeManagement.API.App_Start
{
    public static class CorsConfig
    {
        public static void RegisterCORS()
        {
            // CORS is configured in Web.config and WebApiConfig
            // This class is for future extensibility
            var allowedOrigin = ConfigurationManager.AppSettings["CorsAllowedOrigin"];
        }
    }
}
