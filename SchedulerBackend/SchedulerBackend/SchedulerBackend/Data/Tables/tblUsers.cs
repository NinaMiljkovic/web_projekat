using System.ComponentModel.DataAnnotations;

namespace SchedulerBackend.Data.Tables
{
    public class tblUsers
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
