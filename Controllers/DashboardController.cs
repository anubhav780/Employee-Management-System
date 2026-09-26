using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SonalikaAPI.Data;
using SonalikaAPI.Models;

namespace SonalikaAPI.Controllers
{
	[Authorize(Roles = "Admin")]
	[ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            Dashboard dashboard = new Dashboard();

            dashboard.TotalEmployees =
                await _context.Employee.CountAsync();

            dashboard.TotalDepartments =
                await _context.Department.CountAsync();

            dashboard.PresentToday =
                await _context.Attendance
                .CountAsync(a => a.Status == "Present");

			dashboard.PendingLeaves =
	await _context.LeaveRequest.CountAsync(l => l.Status == "Pending");

			dashboard.TotalSalaryRecords =
                await _context.Salary.CountAsync();

            dashboard.ActiveEmployees =
                await _context.Employee.CountAsync(e => e.IsActive);

            return Ok(dashboard);
        }
    }
}