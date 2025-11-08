using Microsoft.AspNetCore.Mvc;
using SchoolEquipmentApi.Models;
using SchoolEquipmentApi.Services;

namespace SchoolEquipmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var users = await _userService.GetAllAsync();
            // Don't return passwords in the response
            var usersWithoutPasswords = users.Select(u => new 
            {
                u.Id,
                u.Email,
                u.Type,
                u.DateCreated
            });
            return Ok(usersWithoutPasswords);
        }

        [HttpPost("register")]
        public async Task<ActionResult<object>> Register([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user already exists
            var existingUser = await _userService.GetByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return BadRequest("User with this email already exists");
            }

            user.DateCreated = DateTime.UtcNow;
            var createdUser = await _userService.CreateAsync(user);
            
            // Return user without password
            var userResponse = new 
            {
                createdUser.Id,
                createdUser.Email,
                createdUser.Type,
                createdUser.DateCreated
            };
            
            return Ok(userResponse);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Email and password are required");
            }

            var user = await _userService.ValidateUserAsync(loginRequest.Email, loginRequest.Password);
            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            // Return user data without password
            var userResponse = new 
            {
                user.Id,
                Email = user.Email,
                Type = user.Type,
                user.DateCreated
            };
            
            return Ok(userResponse);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}
