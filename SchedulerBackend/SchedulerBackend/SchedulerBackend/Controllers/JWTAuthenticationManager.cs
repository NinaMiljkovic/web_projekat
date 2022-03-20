using Microsoft.IdentityModel.Tokens;
using SchedulerBackend.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SchedulerBackend.Controllers
{
    public class JWTAuthenticationManager : IJWTAuthenticationManager
    {
        private readonly string key;
        public JWTAuthenticationManager(string _key)
        {
            key = _key;
        }
        public string Authenticate(DatabaseContext databaseContext, string email, string password)
        {
            var user = databaseContext.Users.FirstOrDefault(x => (x.Email == email) && (x.Password == password));
            if (user != null)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenKey = Encoding.ASCII.GetBytes(key);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, email),
                        new Claim("ID", user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(tokenKey),
                        SecurityAlgorithms.HmacSha256Signature
                        )
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }

            return null;
        }
    }
}
