using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace cardprintingAPI.Models;

public partial class CardTemplate
{
    public int TemplateId { get; set; }

    public int CategoryId { get; set; }

    public string Title { get; set; } = null!;

    public string? CardTemplateDescription { get; set; }

    public string FilePath { get; set; } = null!;

    public bool IsPremium { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    public virtual TemplateCategory? Category { get; set; }
    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
