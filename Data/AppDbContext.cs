using Microsoft.EntityFrameworkCore;
using SonalikaAPI.Models;

namespace SonalikaAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {
        }

        public DbSet<EmployeeLogin> EmployeeLogin { get; set; }//property
        
        public DbSet<Employee> Employee { get; set; }

        public DbSet<Department> Department { get; set; }

        public DbSet<Attendance> Attendance { get; set; }

        public DbSet<LeaveRequest> LeaveRequest { get; set; }

        public DbSet<Salary> Salary { get; set; }

      
        /*
        read : 
         */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeeLogin>()
                .HasKey(e => e.EmpID);

            base.OnModelCreating(modelBuilder);
        }
    }
}