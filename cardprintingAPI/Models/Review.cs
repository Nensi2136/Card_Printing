using System;
using System.Collections.Generic;

namespace cardprintingAPI.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int UserId { get; set; }

    public int TemplateId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual CardTemplate Template { get; set; } = null!;

    public virtual UserDetail User { get; set; } = null!;
}
