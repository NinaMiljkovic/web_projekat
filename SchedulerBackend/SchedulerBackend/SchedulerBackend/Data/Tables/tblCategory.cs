using System.ComponentModel.DataAnnotations;

namespace SchedulerBackend.Data.Tables
{
    public class tblCategory
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
