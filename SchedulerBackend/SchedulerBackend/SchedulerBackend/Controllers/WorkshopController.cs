using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchedulerBackend.Data;
using SchedulerBackend.Data.Tables;
using SchedulerBackend.Models;
using System.Collections;

namespace SchedulerBackend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshopController : ControllerBase
    {
        private readonly DatabaseContext databaseContext;

        public WorkshopController(DatabaseContext _databaseContext)
        {
            databaseContext = _databaseContext;
        }

       
        [Route("GetWorkshops")]
        [HttpGet]
        public IActionResult GetWorkshops()
        {
            List<WorkshopOutput> response = new List<WorkshopOutput>();
            try
            {
                var users = databaseContext.Users;
                var workshops = databaseContext.Workshops;
                var categories = databaseContext.Category;
                var attendees = databaseContext.Attendance;

                foreach (tblWorkshops entry in workshops.ToList())
                {
                    tblUsers organizer = users.Where(x => x.Id == entry.OrganizerId).First();
                    var tblAttendeeIds = attendees.Where(x => x.WorkshopId == entry.Id);

                    List<UserOutput> _attendees = new List<UserOutput>();

                    foreach (tblAttendance tblAttendance in tblAttendeeIds.ToList())
                    {
                        var attendee = users.Where(x => x.Id == tblAttendance.UserId).First();
                        _attendees.Add(new UserOutput
                        {
                            Id = attendee.Id,
                            Name = attendee.Name,
                        });
                    }

                    WorkshopOutput workshop = new WorkshopOutput
                    {
                        Id = entry.Id,
                        Name = entry.Name,
                        Organizer = new UserOutput
                        {
                            Id = organizer.Id,
                            Name = organizer.Name,
                            Email = organizer.Email,
                        },
                        Date = entry.Date,
                        AvailableSlots = entry.NoOfSlots,
                        Attendees = _attendees,
                        Category = categories.FirstOrDefault(x => x.Id == entry.CategoryId)
                    };

                    response.Add(workshop);
                }
            }
            catch (NullReferenceException e)
            {
                return StatusCode(500, e.Message);
            }
            return StatusCode(200, response);
        }

        [Route("GetUser")]
        [HttpGet]
        public IActionResult GetUser()
        { 
            var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase)).Value;
            var user = databaseContext.Users.FirstOrDefault(x => x.Id == Int32.Parse(userId));

            user.Password = "";

            return StatusCode(200, user);
        }

        [Route("GetCategories")]
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = databaseContext.Category;
            if (categories.ToList().Count() == 0)
                return StatusCode(500);
            return StatusCode(200, categories);

        }

        [Route("CreateWorkshop")]
        [HttpPost]
        public IActionResult CrateWorkshop([FromBody] tblWorkshops request)
        {
            tblWorkshops workshop = new tblWorkshops();
            workshop.Name = request.Name;
            workshop.OrganizerId = request.OrganizerId;
            workshop.Date = request.Date;
            workshop.NoOfSlots = request.NoOfSlots;
            workshop.CategoryId = request.CategoryId;

            try
            {
                databaseContext.Workshops.Add(workshop);
                databaseContext.SaveChanges();

                return StatusCode(200);
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }

        [Route("CreateCategory")]
        [HttpPost]
        public IActionResult CreateCategory([FromBody] tblCategory category)
        {
            try
            {
                if (databaseContext.Category.FirstOrDefault(x => x.Name == category.Name) == null)
                {
                    databaseContext.Category.Add(category);
                    databaseContext.SaveChanges();
                }
                else 
                {
                    return StatusCode(500, "kategorija vec postoji");
                }
                
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
            int categoryId = databaseContext.Category.FirstOrDefault(x => x.Name == category.Name).Id;
            return StatusCode(200, categoryId);
        }

        [Route("CreateAttendee/{WorkshopId}")]
        [HttpPost]
        public IActionResult CrateAttendee([FromRoute] int WorkshopId)
        {
            tblAttendance attendee = new tblAttendance();
            attendee.WorkshopId = WorkshopId;

            var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase));
            if (userId != null)
            {
                attendee.UserId = Int32.Parse(userId.Value);
            }

            try
            {
                if (databaseContext.Attendance.Where(x => (x.WorkshopId == attendee.WorkshopId) && (x.UserId == attendee.UserId)).Count() > 0)
                {
                    return StatusCode(500, "Vec ste se prijavili na ovu radionicu");
                }

                databaseContext.Attendance.Add(attendee);
                databaseContext.SaveChanges();

                return StatusCode(200, attendee.Id);
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }

        [Route("UpdateWorkshop")]
        [HttpPut]
        public IActionResult UpdateWorkshop([FromBody] tblWorkshops request)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase));
                var organizer = databaseContext.Users.FirstOrDefault(x => x.Id == Int32.Parse(userId.Value));

                if (organizer != null && organizer.Id == request.OrganizerId)
                {
                    var workshop = databaseContext.Workshops.FirstOrDefault(x => x.Id == request.Id);
                    if (workshop != null)
                    {
                        workshop.Name = request.Name;
                        workshop.Date = request.Date;
                        workshop.NoOfSlots = request.NoOfSlots;
                        workshop.CategoryId = request.CategoryId;

                        databaseContext.Entry(workshop).State = EntityState.Modified;
                        databaseContext.SaveChanges(true);

                        return StatusCode(200, workshop.Id);
                    }
                    else
                    {
                        return StatusCode(404, "Radionica nije pronadjena");
                    }
                }
                else 
                {
                    return StatusCode(500, "Organizator sa datim parametrima nije pronadjen");
                }
            }
            catch (Exception e)
            {

                throw;
            }

            
        }

        [Route("UpdateUser/{password}")]
        [HttpPut]
        public IActionResult UpdateOrganizer([FromBody] tblUsers request, [FromRoute] string password)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase));
                var organizer = databaseContext.Users.FirstOrDefault(x => (x.Id == Int32.Parse(userId.Value)) && (x.Password == password));
                if (organizer == null)
                {
                    return StatusCode(404, "Pogresna lozinka");
                }

                organizer.Name = request.Name;
                organizer.Password = request.Password;

                databaseContext.Entry(organizer).State = EntityState.Modified;
                databaseContext.SaveChanges();

                return StatusCode(200, organizer);
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }           
        }

        [Route("DeleteWorkshop/{workshopId}")]
        [HttpDelete]
        public IActionResult DeleteWorkshop([FromRoute] int workshopId)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase));
                var organizer = databaseContext.Users.FirstOrDefault(x => x.Id == Int32.Parse(userId.Value));

                var requestedWorkshop = databaseContext.Workshops.FirstOrDefault(x => x.Id == workshopId);

                if (organizer != null && organizer.Id == requestedWorkshop.OrganizerId)
                {
                    var workshop = databaseContext.Workshops.FirstOrDefault(x => x.Id == requestedWorkshop.Id);
                    if (workshop != null)
                    {
                        
                        var attendees = databaseContext.Attendance.Where(x => x.WorkshopId == workshop.Id);
                        foreach (var atendee in attendees)
                            databaseContext.Remove(atendee);

                        databaseContext.Remove(workshop);
                        databaseContext.SaveChanges(true);

                        return StatusCode(200, workshop.Id);
                    }
                    else
                    {
                        return StatusCode(404, "Radionica nije pronadjena");
                    }
                }
                else
                {
                    return StatusCode(500, "Organizator sa datim parametrima nije pronadjen");
                }
            }
            catch (Exception e)
            {

                throw;
            }


        }

        [Route("DeleteUser")]
        [HttpDelete]
        public IActionResult DeleteOrganizer([FromBody] string password)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase));
                var organizer = databaseContext.Users.FirstOrDefault(x => (x.Id == Int32.Parse(userId.Value)) && (x.Password == password));
                if (organizer == null)
                {
                    return StatusCode(404, "Korisnik nije pronadjen");
                }

                var workshops = databaseContext.Workshops.Where(x => x.OrganizerId == organizer.Id);

                foreach (var workshop in workshops)
                {
                    databaseContext.Remove(workshop);
                    var attendees = databaseContext.Attendance.Where(x => x.WorkshopId == workshop.Id);
                    foreach (var atendee in attendees)
                        databaseContext.Remove(atendee);
                }

                var attendance = databaseContext.Attendance.Where(x => x.UserId == organizer.Id);

                databaseContext.Remove(organizer);
                databaseContext.SaveChanges();

                return StatusCode(200, "Korisnik uspesno izbrisan");
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }

        [Route("DeleteAttendee/{WorkshopId}")]
        [HttpDelete]
        public IActionResult DeleteAttendee([FromRoute] int WorkshopId)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type.Equals("ID", StringComparison.InvariantCultureIgnoreCase));
            var attendance = databaseContext.Attendance.FirstOrDefault(x => (x.UserId == Int32.Parse(userId.Value)) && (x.WorkshopId == WorkshopId));
            try
            {
                databaseContext.Remove(attendance);
                databaseContext.SaveChanges();

                return StatusCode(200);
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }
    };
}
