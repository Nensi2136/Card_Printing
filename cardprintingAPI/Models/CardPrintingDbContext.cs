using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Models;

public partial class CardPrintingDbContext : DbContext
{
    public CardPrintingDbContext()
    {
    }

    public CardPrintingDbContext(DbContextOptions<CardPrintingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CardTemplate> CardTemplates { get; set; }

    public virtual DbSet<ContactU> ContactUs { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<TemplateCategory> TemplateCategories { get; set; }

    public virtual DbSet<UserDetail> UserDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CardTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__Card_Tem__E7FB8F21590E1F98");

            entity.ToTable("Card_Template");

            entity.Property(e => e.TemplateId).HasColumnName("Template_Id");
            entity.Property(e => e.CardTemplateDescription)
                .IsUnicode(false)
                .HasColumnName("Card_Template_Description");
            entity.Property(e => e.CategoryId).HasColumnName("Category_Id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Created_at");
            entity.Property(e => e.FilePath).HasColumnName("File_Path");
            entity.Property(e => e.IsPremium).HasColumnName("Is_premium");
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("Updated_at");

            entity.HasOne(d => d.Category).WithMany(p => p.CardTemplates)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Card_Temp__Categ__5535A963");
        });

        modelBuilder.Entity<ContactU>(entity =>
        {
            entity.HasKey(e => e.ContactId).HasName("PK__Contact___82ACC1ED214C15D5");

            entity.ToTable("Contact_Us");

            entity.Property(e => e.ContactId).HasColumnName("Contact_Id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("Created_at");
            entity.Property(e => e.Email).HasMaxLength(80);
            entity.Property(e => e.Message).IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("User_Id");

            entity.HasOne(d => d.User).WithMany(p => p.ContactUs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Contact_U__User___628FA481");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__ED1FC9EA4F56FBFC");

            entity.ToTable("Payment");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.AcountNumber).HasColumnName("Acount_Number");
            entity.Property(e => e.CardExpiryDate)
                .HasMaxLength(10)
                .HasColumnName("Card_Expiry_Date");
            entity.Property(e => e.CvvNumber).HasColumnName("CVV_Number");
            entity.Property(e => e.PaymentDate)
                .HasColumnType("datetime")
                .HasColumnName("Payment_Date");
            entity.Property(e => e.UserId).HasColumnName("User_id");

            entity.HasOne(d => d.User).WithMany(p => p.Payments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payment__User_id__59FA5E80");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Review__F85DA78B21F66F06");

            entity.ToTable("Review");

            entity.Property(e => e.ReviewId).HasColumnName("Review_Id");
            entity.Property(e => e.Comment).IsUnicode(false);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Created_At");
            entity.Property(e => e.TemplateId).HasColumnName("Template_Id");
            entity.Property(e => e.UserId).HasColumnName("User_Id");

            entity.HasOne(d => d.Template).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Review__Template__5DCAEF64");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Review__User_Id__5CD6CB2B");
        });

        modelBuilder.Entity<TemplateCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Template__6DB38D6ECBA8D63F");

            entity.ToTable("Template_Category");

            entity.HasIndex(e => e.CategoryName, "UQ__Template__B35EB4194F144C36").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("Category_Id");
            entity.Property(e => e.CategoryDescription)
                .IsUnicode(false)
                .HasColumnName("Category_Description");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("Category_Name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Created_at");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("Updated_at");
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User_Det__206D917014D15CD7");

            entity.ToTable("User_Detail");

            entity.HasIndex(e => e.PasswordHash, "UQ__User_Det__366B1CCF88B6B324").IsUnique();

            entity.HasIndex(e => e.Username, "UQ__User_Det__536C85E43D4ADA8E").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__User_Det__A9D10534650FDD7F").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("User_Id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Created_at");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.IsAdmin).HasColumnName("Is_admin");
            entity.Property(e => e.IsPremium).HasColumnName("Is_premium");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(60)
                .HasColumnName("Password_hash");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("Updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
