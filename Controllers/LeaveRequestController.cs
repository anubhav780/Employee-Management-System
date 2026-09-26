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
    public class LeaveRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveRequestController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL

        [HttpGet]
        public async Task<IActionResult> GetLeaveRequests()
        {
            return Ok(await _context.LeaveRequest.ToListAsync());
        }

        // GET BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveRequest(int id)
        {
            var leave = await _context.LeaveRequest.FindAsync(id);

            if (leave == null)
                return NotFound();

            return Ok(leave);
        }

        // ADD

        [HttpPost]
        public async Task<IActionResult> AddLeaveRequest(LeaveRequest leave)
        {
            var employee = await _context.Employee.FindAsync(leave.EmpID);

            if (employee == null)
                return BadRequest("Employee does not exist.");

            _context.LeaveRequest.Add(leave);

            await _context.SaveChangesAsync();

            return Ok(leave);
        }

        // UPDATE

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveRequest(int id, LeaveRequest leave)
        {
            if (id != leave.LeaveID)
                return BadRequest();

            _context.Entry(leave).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(leave);
        }

        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveRequest(int id)
        {
            var leave = await _context.LeaveRequest.FindAsync(id);

            if (leave == null)
                return NotFound();

            _context.LeaveRequest.Remove(leave);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}