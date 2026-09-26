using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SonalikaAPI.Models
{
    public class Salary
    {
        [Key]
        public int SalaryID { get; set; }

        public int EmpID { get; set; }

        public decimal BasicSalary { get; set; }

        public decimal Bonus { get; set; }

        public decimal Deduction { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal NetSalary { get; set; }
    }
}