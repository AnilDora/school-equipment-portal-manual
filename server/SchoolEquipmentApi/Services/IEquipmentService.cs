using SchoolEquipmentApi.Models;

namespace SchoolEquipmentApi.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<Equipment>> GetAllAsync();
        Task<Equipment?> GetByIdAsync(string id);
        Task<Equipment> CreateAsync(Equipment equipment);
        Task UpdateAsync(string id, Equipment equipment);
        Task DeleteAsync(string id);
        Task<IEnumerable<Equipment>> GetByCategoryAsync(string category);
    }
}