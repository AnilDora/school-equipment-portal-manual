using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolEquipmentApi.Models
{
    public class Equipment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("category")]
        public string Category { get; set; } = string.Empty; // sports, lab, music, art
        
        [Required]
        [BsonElement("condition")]
        public string Condition { get; set; } = string.Empty; // excellent, good, fair, poor
        
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        [BsonElement("quantity")]
        public int Quantity { get; set; }
        
        [Range(0, int.MaxValue, ErrorMessage = "Available must be non-negative")]
        [BsonElement("available")]
        public int Available { get; set; }
        
        [BsonElement("description")]
        public string? Description { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
