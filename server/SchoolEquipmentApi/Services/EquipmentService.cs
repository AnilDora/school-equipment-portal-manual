using MongoDB.Driver;
using Microsoft.Extensions.Options;
using SchoolEquipmentApi.Models;

namespace SchoolEquipmentApi.Services
{
    public class EquipmentService : IEquipmentService
    {
        private readonly IMongoCollection<Equipment> _equipmentCollection;

        public EquipmentService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _equipmentCollection = mongoDatabase.GetCollection<Equipment>(mongoDbSettings.Value.EquipmentCollectionName);
        }

        public async Task<IEnumerable<Equipment>> GetAllAsync()
        {
            return await _equipmentCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Equipment?> GetByIdAsync(string id)
        {
            return await _equipmentCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Equipment> CreateAsync(Equipment equipment)
        {
            equipment.CreatedAt = DateTime.UtcNow;
            equipment.UpdatedAt = DateTime.UtcNow;
            await _equipmentCollection.InsertOneAsync(equipment);
            return equipment;
        }

        public async Task UpdateAsync(string id, Equipment equipment)
        {
            equipment.UpdatedAt = DateTime.UtcNow;
            await _equipmentCollection.ReplaceOneAsync(x => x.Id == id, equipment);
        }

        public async Task DeleteAsync(string id)
        {
            await _equipmentCollection.DeleteOneAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Equipment>> GetByCategoryAsync(string category)
        {
            return await _equipmentCollection.Find(x => x.Category == category).ToListAsync();
        }
    }
}