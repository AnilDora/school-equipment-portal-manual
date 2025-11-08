using SchoolEquipmentApi.Models;
using SchoolEquipmentApi.Services;

namespace SchoolEquipmentApi.Services
{
    public class DatabaseSeeder
    {
        private readonly IUserService _userService;
        private readonly IEquipmentService _equipmentService;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(IUserService userService, IEquipmentService equipmentService, ILogger<DatabaseSeeder> logger)
        {
            _userService = userService;
            _equipmentService = equipmentService;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            // Seed users if they don't exist
            await SeedUsersAsync();
            await SeedEquipmentAsync();
        }

        private async Task SeedUsersAsync()
        {
            var existingUsers = await _userService.GetAllAsync();
            if (!existingUsers.Any())
            {
                _logger.LogInformation("Seeding default users...");

                var defaultUsers = new List<User>
                {
                    new User { Email = "admin@school.edu", Password = "admin123", Type = "administrator" },
                    new User { Email = "labassistant@school.edu", Password = "lab123", Type = "lab_assistant" },
                    new User { Email = "teacher@school.edu", Password = "teacher123", Type = "teacher" },
                    new User { Email = "student@school.edu", Password = "student123", Type = "student" }
                };

                foreach (var user in defaultUsers)
                {
                    await _userService.CreateAsync(user);
                    _logger.LogInformation($"Created user: {user.Email}");
                }
            }
        }

        private async Task SeedEquipmentAsync()
        {
            var existingEquipment = await _equipmentService.GetAllAsync();
            if (!existingEquipment.Any())
            {
                _logger.LogInformation("Seeding default equipment...");

                var defaultEquipment = new List<Equipment>
                {
                    new Equipment { Name = "Basketball", Category = "sports", Condition = "good", Quantity = 10, Available = 8, Description = "Standard basketball for outdoor use" },
                    new Equipment { Name = "Soccer Ball", Category = "sports", Condition = "excellent", Quantity = 15, Available = 12, Description = "FIFA approved soccer ball" },
                    new Equipment { Name = "Microscope", Category = "lab", Condition = "good", Quantity = 5, Available = 3, Description = "Digital microscope for biology lab" },
                    new Equipment { Name = "Test Tubes", Category = "lab", Condition = "excellent", Quantity = 50, Available = 45, Description = "Glass test tubes for chemistry experiments" },
                    new Equipment { Name = "Guitar", Category = "music", Condition = "fair", Quantity = 8, Available = 6, Description = "Acoustic guitar for music class" },
                    new Equipment { Name = "Piano Keyboard", Category = "music", Condition = "good", Quantity = 3, Available = 2, Description = "Digital piano keyboard" },
                    new Equipment { Name = "Paint Brushes", Category = "art", Condition = "good", Quantity = 25, Available = 20, Description = "Set of various paint brushes" },
                    new Equipment { Name = "Canvas", Category = "art", Condition = "excellent", Quantity = 30, Available = 25, Description = "Blank canvas for painting" }
                };

                foreach (var equipment in defaultEquipment)
                {
                    await _equipmentService.CreateAsync(equipment);
                    _logger.LogInformation($"Created equipment: {equipment.Name}");
                }
            }
        }
    }
}