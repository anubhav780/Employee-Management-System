using System.ComponentModel.DataAnnotations;

namespace SonalikaAPI.Models
{
    public class EmployeeLogin
    {
        [Key]
        public int LoginID { get; set; }

        public int EmpID { get; set; }

        public string EmpCode { get; set; } = "";

        public string PasswordHash { get; set; } = "";

        public string Role { get; set; } = "";

        public bool IsActive { get; set; }
    }
}