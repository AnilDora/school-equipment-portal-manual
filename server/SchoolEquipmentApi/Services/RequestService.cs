using MongoDB.Driver;
using Microsoft.Extensions.Options;
using SchoolEquipmentApi.Models;

namespace SchoolEquipmentApi.Services
{
    public class RequestService : IRequestService
    {
        private readonly IMongoCollection<BorrowRequest> _requestsCollection;

        public RequestService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _requestsCollection = mongoDatabase.GetCollection<BorrowRequest>(mongoDbSettings.Value.RequestsCollectionName);
        }

        public async Task<IEnumerable<BorrowRequest>> GetAllAsync()
        {
            return await _requestsCollection.Find(_ => true).ToListAsync();
        }

        public async Task<BorrowRequest?> GetByIdAsync(string id)
        {
            return await _requestsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<BorrowRequest> CreateAsync(BorrowRequest request)
        {
            request.CreatedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;
            await _requestsCollection.InsertOneAsync(request);
            return request;
        }

        public async Task UpdateAsync(string id, BorrowRequest request)
        {
            request.UpdatedAt = DateTime.UtcNow;
            await _requestsCollection.ReplaceOneAsync(x => x.Id == id, request);
        }

        public async Task DeleteAsync(string id)
        {
            await _requestsCollection.DeleteOneAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<BorrowRequest>> GetByUserAsync(string userEmail)
        {
            return await _requestsCollection.Find(x => x.User == userEmail).ToListAsync();
        }

        public async Task<IEnumerable<BorrowRequest>> GetByStatusAsync(string status)
        {
            return await _requestsCollection.Find(x => x.Status == status).ToListAsync();
        }
    }
}