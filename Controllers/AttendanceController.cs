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
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL

        [HttpGet]
        public async Task<IActionResult> GetAttendance()
        {
            return Ok(await _context.Attendance.ToListAsync());
        }

        // GET BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAttendance(int id)
        {
            var attendance = await _context.Attendance.FindAsync(id);

            if (attendance == null)
                return NotFound();

            return Ok(attendance);
        }

        // ADD

        [HttpPost]
        public async Task<IActionResult> AddAttendance(Attendance attendance)
        {
            _context.Attendance.Add(attendance);

            await _context.SaveChangesAsync();

            return Ok(attendance);
        }

        // UPDATE

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttendance(int id, Attendance attendance)
        {
            if (id != attendance.AttendanceID)
                return BadRequest();

            _context.Entry(attendance).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(attendance);
        }

        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var attendance = await _context.Attendance.FindAsync(id);

            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendance.Remove(attendance);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}