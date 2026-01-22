using System;
using System.Collections.Generic;

namespace cardprintingAPI.Models;

public partial class ContactU
{
    public int ContactId { get; set; }

    public int? UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual UserDetail? User { get; set; }
}
