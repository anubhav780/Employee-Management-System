using System.ComponentModel.DataAnnotations;

namespace SonalikaAPI.Models
{
    public class LeaveRequest
    {
        [Key]
        public int LeaveID { get; set; }

        public int EmpID { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string Status { get; set; } = "Pending";
    }
}