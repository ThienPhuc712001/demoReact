using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace EmployeeManagement.API.Repository
{
    public static class DbFactory
    {
        private static readonly string ConnectionString;

        static DbFactory()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        }

        public static IDbConnection CreateConnection()
        {
            return new SqlConnection(ConnectionString);
        }
    }
}
