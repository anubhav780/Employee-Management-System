using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SonalikaAPI.Data;
using SonalikaAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace SonalikaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(
    AppDbContext context,
    IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.EmployeeLogin
                .FirstOrDefaultAsync(x =>
                    x.EmpCode == request.EmpCode &&
                    x.PasswordHash == request.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid Employee Code or Password."
                });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new
                {
                    message = "Your account is inactive."
                });
            }

            if (user.Role != "Admin")
            {
                return Unauthorized(new
                {
                    message = "Only Admin can login."
                });
            }

            string token = GenerateToken(user);

            return Ok(new
            {
                message = "Login Successful",

                token = token,

                role = user.Role
            });

        }
        private string GenerateToken(EmployeeLogin user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.EmpCode),

        new Claim(ClaimTypes.Role, user.Role)
    };

            var key = new SymmetricSecurityKey(

                Encoding.UTF8.GetBytes(

                _configuration["Jwt:Key"]));

            var credentials =

                new SigningCredentials(

                key,

                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(

                issuer: _configuration["Jwt:Issuer"],

                audience: _configuration["Jwt:Audience"],

                claims: claims,

                expires: DateTime.Now.AddHours(2),

                signingCredentials: credentials);

            return new JwtSecurityTokenHandler()

                .WriteToken(token);
        }
    }
}