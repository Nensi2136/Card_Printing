using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace cardprintingAPI.Models;

public partial class Payment
{
    public int PaymentId { get; set; }
    public int UserId { get; set; }
    public long AcountNumber { get; set; }
    public long CvvNumber { get; set; }
    public string CardExpiryDate { get; set; } = null!;
    public double Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    [JsonIgnore]
    [ValidateNever]
    public virtual UserDetail User { get; set; } = null!;

}
