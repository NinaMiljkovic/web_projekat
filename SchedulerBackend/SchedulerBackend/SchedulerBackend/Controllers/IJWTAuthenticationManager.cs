using SchedulerBackend.Data;

namespace SchedulerBackend.Controllers
{
    public interface IJWTAuthenticationManager
    {
        String Authenticate(DatabaseContext databaseContext, String email, String password);
    }
}
