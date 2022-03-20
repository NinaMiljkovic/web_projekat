using System.ComponentModel.DataAnnotations;

namespace SchedulerBackend.Data.Tables
{
    public class tblWorkshops
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrganizerId { get; set; }
        public DateTime Date { get; set; }
        public int NoOfSlots { get; set; }
        public int CategoryId { get; set; }
    }
}
