using System.ComponentModel.DataAnnotations;

namespace SonalikaAPI.Models
{
    public class Department
    {
        [Key]
        public int DeptID { get; set; }

        public string DeptName { get; set; } = string.Empty;
    }
}