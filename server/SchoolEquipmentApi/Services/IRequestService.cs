using SchoolEquipmentApi.Models;

namespace SchoolEquipmentApi.Services
{
    public interface IRequestService
    {
        Task<IEnumerable<BorrowRequest>> GetAllAsync();
        Task<BorrowRequest?> GetByIdAsync(string id);
        Task<BorrowRequest> CreateAsync(BorrowRequest request);
        Task UpdateAsync(string id, BorrowRequest request);
        Task DeleteAsync(string id);
        Task<IEnumerable<BorrowRequest>> GetByUserAsync(string userEmail);
        Task<IEnumerable<BorrowRequest>> GetByStatusAsync(string status);
    }
}