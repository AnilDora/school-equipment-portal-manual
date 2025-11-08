using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolEquipmentApi.Models
{
    public class BorrowRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("itemId")]
        public string ItemId { get; set; } = string.Empty; // Equipment ID (MongoDB ObjectId)
        
        [Required]
        [BsonElement("user")]
        public string User { get; set; } = string.Empty; // User email
        
        [Required]
        [BsonElement("userType")]
        public string UserType { get; set; } = string.Empty; // User type
        
        [Required]
        [BsonElement("borrowDate")]
        public string BorrowDate { get; set; } = string.Empty; // Date string
        
        [Required]
        [BsonElement("returnDate")]
        public string ReturnDate { get; set; } = string.Empty; // Date string
        
        [Required]
        [BsonElement("status")]
        public string Status { get; set; } = "pending"; // "pending", "approved", "rejected", "returned"
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
