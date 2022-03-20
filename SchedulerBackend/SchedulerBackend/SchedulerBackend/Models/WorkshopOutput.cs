using SchedulerBackend.Data.Tables;

namespace SchedulerBackend.Models
{
    public class WorkshopOutput
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public UserOutput Organizer { get; set; }
        public DateTime Date { get; set; }
        public int AvailableSlots { get; set; }
        public List<UserOutput> Attendees { get; set; }
        public tblCategory Category { get; set; }
    }
}
