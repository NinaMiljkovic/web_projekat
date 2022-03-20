using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchedulerBackend.Data;
using SchedulerBackend.Data.Tables;

namespace SchedulerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly DatabaseContext databaseContext;
        private readonly IJWTAuthenticationManager authenticationManager;

        public AuthenticationController(DatabaseContext _databaseContext, IJWTAuthenticationManager jWTAuthenticationManager)
        {
            databaseContext = _databaseContext;
            authenticationManager = jWTAuthenticationManager;
        }

        [Route("Login")]
        [HttpPost]
        public IActionResult Login([FromBody] UserCred userCred) 
        {
            var token = authenticationManager.Authenticate(databaseContext, userCred.Email, userCred.Password);
            if (token == null)
               return StatusCode(500, "Uneli ste pogresnu lozinku.");
            return Ok(token);
        }

        [Route("Register")]
        [HttpPost]
        public IActionResult Register([FromBody] tblUsers request)
        {
            tblUsers user = new tblUsers();
            user.Name = request.Name;
            user.Email = request.Email;
            user.Password = request.Password;

            try
            {
                if (databaseContext.Users.Where(x => x.Email == user.Email).Count() > 0)
                {
                    return StatusCode(500, "Vec postoji korisnik sa istim email-om");
                }

                databaseContext.Users.Add(user);
                databaseContext.SaveChanges();


                var token = authenticationManager.Authenticate(databaseContext, user.Email, user.Password);
                if (token == null)
                    return Unauthorized();
                return Ok(token);
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }
    }
}
    