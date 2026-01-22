
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace cardprintingAPI.Models;

public partial class UserDetail
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool IsPremium { get; set; }

    public bool IsAdmin { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    [JsonIgnore]
    public virtual ICollection<ContactU> ContactUs { get; set; } = new List<ContactU>();
    [JsonIgnore]
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
