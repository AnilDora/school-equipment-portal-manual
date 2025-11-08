namespace SchoolEquipmentApi.Models
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string UsersCollectionName { get; set; } = "Users";
        public string EquipmentCollectionName { get; set; } = "Equipment";
        public string RequestsCollectionName { get; set; } = "Requests";
    }
}