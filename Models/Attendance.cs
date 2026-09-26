using System.ComponentModel.DataAnnotations;

namespace SonalikaAPI.Models
{
    public class Attendance
    {
        [Key]
        public int AttendanceID { get; set; }

        public int EmpID { get; set; }

        public DateTime AttendanceDate { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}