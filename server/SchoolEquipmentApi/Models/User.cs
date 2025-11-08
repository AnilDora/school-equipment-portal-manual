using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolEquipmentApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("type")]
        public string Type { get; set; } = string.Empty; // "administrator", "lab_assistant", "teacher", "student"
        
        [BsonElement("dateCreated")]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}
