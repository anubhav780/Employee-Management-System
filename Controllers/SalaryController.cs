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
    public class SalaryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SalaryController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL

        [HttpGet]
        public async Task<IActionResult> GetSalary()
        {
            return Ok(await _context.Salary.ToListAsync());
        }

        // GET BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalary(int id)
        {
            var salary = await _context.Salary.FindAsync(id);

            if (salary == null)
                return NotFound();

            return Ok(salary);
        }

        // ADD

        [HttpPost]
        public async Task<IActionResult> AddSalary(Salary salary)
        {
            var employee = await _context.Employee.FindAsync(salary.EmpID);

            if (employee == null)
                return BadRequest("Employee does not exist.");

            salary.NetSalary = salary.BasicSalary + salary.Bonus;

            _context.Salary.Add(salary);

            await _context.SaveChangesAsync();

            return Ok(salary);
        }

        // UPDATE

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalary(int id, Salary salary)
        {
            if (id != salary.SalaryID)
                return BadRequest();

            salary.NetSalary = salary.BasicSalary + salary.Bonus;

            _context.Entry(salary).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(salary);
        }

        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalary(int id)
        {
            var salary = await _context.Salary.FindAsync(id);

            if (salary == null)
                return NotFound();

            _context.Salary.Remove(salary);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}