using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace cardprintingAPI.Models;

public partial class TemplateCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? CategoryDescription { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    [JsonIgnore]
    public virtual ICollection<CardTemplate> CardTemplates { get; set; } = new List<CardTemplate>();
}
