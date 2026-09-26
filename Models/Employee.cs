using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SonalikaAPI.Models
{
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmpID { get; set; }

        public string EmpName { get; set; } = string.Empty;

        public decimal Salary { get; set; }

        public int DeptID { get; set; }

        public bool IsActive { get; set; } = true;
    }
}