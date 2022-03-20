using System.ComponentModel.DataAnnotations;

namespace SchedulerBackend.Data.Tables
{
    public class tblAttendance
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int WorkshopId { get; set; }
    }
}
