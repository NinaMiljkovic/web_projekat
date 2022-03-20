using Microsoft.EntityFrameworkCore;
using SchedulerBackend.Data.Tables;

namespace SchedulerBackend.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<tblUsers> Users { get; set; }
        public DbSet<tblWorkshops> Workshops { get; set; }
        public DbSet<tblCategory> Category { get; set; }
        public DbSet<tblAttendance> Attendance { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }
    }
}
