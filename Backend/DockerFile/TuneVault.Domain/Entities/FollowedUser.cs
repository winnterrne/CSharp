namespace TuneVault.Domain.Entities
{
    public class FollowedUser
    {
        public string UserID { get; set; } = "";
        public string? UserName { get; set; }
        public string? UserImage { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? Phone { get; set; }
    }
}