using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SonalikaAPI.Data;
using SonalikaAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace SonalikaAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL

        [HttpGet]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await
                (from e in _context.Employee
                 join d in _context.Department
                 on e.DeptID equals d.DeptID

                 select new
                 {
                     e.EmpID,
                     e.EmpName,
                     Department = d.DeptName,
                     e.Salary,
                     e.IsActive
                 }).ToListAsync();

            return Ok(employees);
        }

        // GET BY ID

        [HttpGet("{id}")]

        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _context.Employee.FindAsync(id);

            if (employee == null)
                return NotFound();

            return Ok(employee);
        }

        // ADD

        [HttpPost]

        public async Task<IActionResult> AddEmployee(Employee employee)
        {
            _context.Employee.Add(employee);

            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        // UPDATE

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.EmpID)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employee.FindAsync(id);

            if (employee == null)
                return NotFound();

            _context.Employee.Remove(employee);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}