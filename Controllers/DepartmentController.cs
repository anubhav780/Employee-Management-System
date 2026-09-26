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
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            return Ok(await _context.Department.ToListAsync());
        }

        // GET BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            var department = await _context.Department.FindAsync(id);

            if (department == null)
                return NotFound();

            return Ok(department);
        }

        // ADD

        [HttpPost]
        public async Task<IActionResult> AddDepartment(Department department)
        {
            _context.Department.Add(department);

            await _context.SaveChangesAsync();

            return Ok(department);
        }

        // UPDATE

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, Department department)
        {
            if (id != department.DeptID)
            {
                return BadRequest();
            }

            _context.Entry(department).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Department.FindAsync(id);

            if (department == null)
                return NotFound();

            _context.Department.Remove(department);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}