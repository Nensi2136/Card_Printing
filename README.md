# CardCraft - Business Card Design Platform

## 📁 Project Structure Overview

This project is a full-stack business card design and printing platform built with React + ASP.NET Core. Below is a comprehensive guide to understand the file structure and code organization.

```
D:\AAD\Card_Printing\
├── card printing UI\              # React Frontend (TypeScript + Vite)
├── cardprintingAPI\               # ASP.NET Core Backend (.NET 8)
├── template\                      # Card template images
├── CarddPrinting.sql              # Database schema
└── README.md                      # This documentation
```

---

## 🖥️ Frontend Structure (`card printing UI/`)

### Core Files
- **`package.json`** - Dependencies and scripts
- **`vite.config.ts`** - Vite build configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration

### Source Code (`src/`)

#### 📱 Main Application Files
```
src/
├── main.tsx                     # Application entry point (renders App.tsx)
├── App.tsx                      # Main app component with routing
├── index.css                    # Global styles
└── vite-env.d.ts               # Vite type definitions
```

#### 🔄 State Management (`context/`)
```
src/context/
└── AppContext.tsx              # Global state management
    ├── User authentication state
    ├── Admin authentication state
    ├── Card customization data
    └── LocalStorage persistence
```

#### 📋 Type Definitions (`types/`)
```
src/types/
└── index.ts                    # TypeScript interfaces
    ├── User interface
    ├── CardData interface
    └── CardTheme interface
```

#### 🧩 Reusable Components (`components/`)
```
src/components/
├── Header.tsx                  # Navigation header
├── Footer.tsx                  # Site footer
├── CardPreview.tsx             # Live card preview component
├── PaymentModal.tsx            # Payment processing modal
└── admin/                      # Admin-specific components
    ├── AdminLayout.tsx         # Admin page layout
    ├── AddCategory.tsx         # Category creation form
    ├── AddCategoryForm.tsx     # Category form component
    └── AddCategoryForm.tsx     # Category form component
```

#### 📄 Page Components (`pages/`)
```
src/pages/
├── Home.tsx                    # Landing page
├── About.tsx                   # About page
├── Contact.tsx                 # Contact form page
├── Login.tsx                   # User login page
├── Register.tsx                # User registration page
├── Product.tsx                 # Product selection page
├── Customize.tsx               # Card customization page
├── Upgrade.tsx                 # Premium upgrade page
└── admin/                      # Admin dashboard pages
    ├── AdminDashboard.tsx      # Main admin dashboard
    ├── AdminLogin.tsx          # Admin login page
    ├── Categories.tsx          # Category management
    ├── Templates.tsx           # Template management
    ├── Users.tsx               # User management
    ├── Payments.tsx            # Payment history
    └── ContactMessages.tsx     # Contact message inbox
```

#### 🔗 API Services (`services/`)
```
src/services/
├── authService.ts              # Authentication logic
├── userDetailService.ts        # User CRUD operations
├── cardTemplateService.ts      # Template operations
├── paymentService.ts           # Payment processing
├── contactService.ts           # Contact form handling
├── dashboardService.ts         # Admin dashboard data
└── templateCategoryService.ts  # Category management
```

#### 🎣 Custom Hooks (`hooks/`)
```
src/hooks/
└── useCategoryForm.ts          # Category form logic
```

---

## 🖥️ Backend Structure (`cardprintingAPI/`)

### Core Files
- **`cardprintingAPI.csproj`** - Project configuration and dependencies
- **`Program.cs`** - Application entry point and configuration
- **`appsettings.json`** - Configuration settings

### Controllers (`Controllers/`)
```
Controllers/
├── CardTemplateController.cs   # Template CRUD operations
├── ContactUController.cs       # Contact message handling
├── PaymentController.cs        # Payment processing
├── ReviewController.cs         # Review management
├── TemplateCategoryController.cs # Category CRUD
└── UserDetailController.cs     # User management
```

**Controller Structure:**
```csharp
[Route("api/[controller]")]
[ApiController]
public class UserDetailController : ControllerBase
{
    private readonly CardPrintingDbContext _context;

    // GET, POST, PUT, DELETE endpoints
    // Database operations via Entity Framework
}
```

### Data Models (`Models/`)
```
Models/
├── CardPrintingDbContext.cs    # EF Core database context
├── CardTemplate.cs             # Template entity
├── ContactU.cs                 # Contact message entity
├── Payment.cs                  # Payment entity
├── Review.cs                   # Review entity
├── TemplateCategory.cs         # Category entity
└── UserDetail.cs               # User entity
```

**Entity Structure Example:**
```csharp
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
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
```

---

## 🗄️ Database Structure (`CarddPrinting.sql`)

### Tables Overview

#### User Management
```sql
User_Detail (
    User_Id int PRIMARY KEY IDENTITY(1,1),
    Username varchar(10) NOT NULL UNIQUE,
    Email nvarchar(50) NOT NULL UNIQUE,
    Password_hash nvarchar(60) NOT NULL,
    Is_premium BIT NOT NULL DEFAULT 0,
    Is_admin BIT NOT NULL DEFAULT 0,
    Created_at Datetime NOT NULL,
    Updated_at Datetime
)
```

#### Template System
```sql
Template_Category (
    Category_Id int IDENTITY(1,1) PRIMARY KEY,
    Category_Name varchar(60) NOT NULL UNIQUE,
    Category_Description varchar(max),
    Created_at Datetime NOT NULL,
    Updated_at Datetime NOT NULL
)

Card_Template (
    Template_Id int IDENTITY(1,1) PRIMARY KEY,
    Category_Id int NOT NULL REFERENCES Template_Category(Category_Id),
    Title varchar(50) NOT NULL,
    Card_Template_Description varchar(max),
    File_Path nvarchar(max) NOT NULL,
    Is_premium BIT NOT NULL DEFAULT 0,
    Created_at Datetime NOT NULL,
    Updated_at Datetime NOT NULL
)
```

#### Business Logic
```sql
Payment (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    User_id INT NOT NULL REFERENCES User_Detail(user_id),
    Acount_Number BIGINT NOT NULL,
    CVV_Number BIGINT NOT NULL,
    Card_Expiry_Date NVARCHAR(10) NOT NULL,
    Amount FLOAT NOT NULL,
    Payment_Date DATETIME NOT NULL
)

Review (
    Review_Id int PRIMARY KEY IDENTITY(1,1),
    User_Id int NOT NULL REFERENCES User_Detail(User_Id),
    Template_Id int NOT NULL REFERENCES Card_Template(Template_Id),
    Rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
    Comment varchar(max),
    Created_At DATETIME NOT NULL
)

Contact_U (
    Contact_Id int PRIMARY KEY IDENTITY(1,1),
    User_Id int REFERENCES User_Detail(User_Id),
    Name nvarchar(50) NOT NULL,
    Email nvarchar(50) NOT NULL,
    Subject nvarchar(100) NOT NULL,
    Message nvarchar(max) NOT NULL,
    Created_At DATETIME NOT NULL
)
```

---

## 🔄 Code Flow & Architecture

### Frontend Architecture

#### 1. Application Entry (`main.tsx`)
```tsx
// Renders the App component into the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### 2. App Component (`App.tsx`)
- **Routing**: React Router for navigation
- **Authentication**: Protected routes for users and admins
- **Layout**: Conditional rendering of Header/Footer for admin routes

```tsx
function App() {
  return (
    <AppProvider>           {/* Global state provider */}
      <Router>              {/* React Router setup */}
        <AppRoutes />       {/* Route definitions */}
      </Router>
    </AppProvider>
  );
}
```

#### 3. State Management (`AppContext.tsx`)
```tsx
// Context provides:
// - User authentication state
// - Admin authentication state
// - Card customization data
// - LocalStorage persistence
```

#### 4. API Communication (`services/`)
```tsx
// Service layer pattern:
// - authService.ts: Authentication logic
// - userDetailService.ts: User CRUD
// - cardTemplateService.ts: Template operations
// - paymentService.ts: Payment processing
```

### Backend Architecture

#### 1. Program.cs - Application Startup
```csharp
var builder = WebApplication.CreateBuilder(args);

// Services registration
builder.Services.AddControllers();
builder.Services.AddDbContext<CardPrintingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
```

#### 2. Controller Pattern
```csharp
[Route("api/[controller]")]
[ApiController]
public class UserDetailController : ControllerBase
{
    private readonly CardPrintingDbContext _context;

    // RESTful endpoints: GET, POST, PUT, DELETE
}
```

#### 3. Entity Framework Core
```csharp
// DbContext manages database connections
public class CardPrintingDbContext : DbContext
{
    public DbSet<UserDetail> UserDetails { get; set; }
    public DbSet<CardTemplate> CardTemplates { get; set; }
    // ... other DbSets
}
```

---

## 👤 User Panel & 👨‍💼 Admin Panel

### 👤 User Panel Features

The user panel provides a complete business card design experience for regular users. Users can create, customize, and export professional business cards with both free and premium options.

#### 🔐 User Authentication
- **Registration**: Create new user accounts with email verification
- **Login**: Secure authentication with password hashing
- **Profile Management**: Update personal information and preferences

#### 🎨 Card Design & Customization
- **Template Selection**: Choose from 500+ professional templates across categories:
  - Standard Business Cards
  - Premium/Luxury Cards
  - Minimalist Designs
  - Creative/Custom Shaped Cards
  - Folded Cards
  - Digital/NFC Cards
  - Magnetic Cards
  - Transparent/Plastic Cards
  - Eco-Friendly Cards
  - Photo Cards

- **Live Customization**: Real-time preview with instant updates
  - Business name and contact details
  - Background colors and images
  - Text colors and typography
  - Professional layout adjustments

#### 💳 Payment & Premium Features
- **Free Tier**: Access to basic templates and standard features
- **Premium Upgrade**: Unlock advanced templates and features
- **Secure Payments**: Process payments for premium subscriptions
- **Payment History**: Track all transactions and receipts

#### 📄 Export & Download
- **PDF Generation**: High-quality PDF export using html2canvas + jsPDF
- **Instant Download**: Immediate file download after customization
- **Print-Ready**: Professional quality suitable for printing services

#### 📞 Support & Communication
- **Contact Form**: Direct messaging to administrators
- **Customer Support**: Get help with design and technical issues

---

### 👨‍💼 Admin Panel Features

The admin panel provides comprehensive platform management capabilities for administrators to monitor, manage, and maintain the business card platform.

#### 🔐 Admin Authentication
- **Secure Login**: Dedicated admin credentials (hardcoded for security)
- **Role-Based Access**: Separate authentication from regular users
- **Session Management**: Persistent admin sessions with logout capability

#### 📊 Dashboard & Analytics
- **Real-Time Statistics**: Live platform metrics and KPIs
  - Total users, active users, premium users
  - Total revenue and payment transactions
  - Template usage and category performance
- **Recent Activity Feed**: Track user actions and system events
- **Export Reports**: Generate and download PDF reports with statistics

#### 👥 User Management
- **User Overview**: View all registered users with detailed information
- **User Filtering**: Search and filter users by status, premium level, registration date
- **User Details**: View complete user profiles and activity history
- **Premium Status**: Manage user premium subscriptions and upgrades

#### 🎨 Template Management
- **Template Library**: View and manage all card templates
- **Category Organization**: Organize templates by categories and themes
- **Premium Settings**: Control which templates require premium access
- **Template Analytics**: Track template popularity and usage statistics

#### 💰 Payment & Revenue Management
- **Payment History**: View all payment transactions and amounts
- **Revenue Tracking**: Monitor total platform revenue and trends
- **Transaction Details**: Complete payment information and user associations
- **Financial Reports**: Generate detailed financial reports and analytics

#### 📬 Contact & Support Management
- **Message Inbox**: View and manage customer contact messages
- **Support Tickets**: Handle user inquiries and support requests
- **Message Filtering**: Search and organize messages by status and date
- **Response Tracking**: Track admin responses and resolution status

#### 🏷️ Category Management
- **Category Creation**: Add new template categories with descriptions
- **Category Editing**: Update category names and descriptions
- **Category Organization**: Maintain logical template groupings
- **Category Analytics**: Track category usage and popularity

---

## 🔗 Key Integration Points

### Authentication Flow
1. **Frontend**: `authService.login()` → API call
2. **Backend**: `UserDetailController` → Database query
3. **Response**: JWT token or session data
4. **State**: Update `AppContext` with user data

### Card Customization Flow
1. **User Input**: Form changes in `Customize.tsx`
2. **State Update**: `setCardData()` in `AppContext`
3. **Preview**: `CardPreview` component renders changes
4. **Export**: `html2canvas` + `jsPDF` for PDF generation

### Admin Dashboard Flow
1. **Authentication**: Admin login via `authService`
2. **Data Fetch**: `dashboardService.getDashboardStats()`
3. **Display**: Charts and tables in `AdminDashboard.tsx`
4. **Management**: CRUD operations via respective controllers

---

## 🛠️ Development Workflow

### Frontend Development
```bash
cd "card printing UI"
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Production build
npm run lint        # Code linting
```

### Backend Development
```bash
cd cardprintingAPI
dotnet restore      # Restore packages
dotnet run         # Start API server
dotnet build       # Build project
```

### Database Development
```sql
-- Run in SQL Server Management Studio
-- Execute CarddPrinting.sql to create database
-- Update connection string in appsettings.json
```

### Adding New Features

#### Frontend Component
1. Create component in `src/components/`
2. Add TypeScript interfaces in `src/types/`
3. Update routing in `App.tsx` if needed
4. Add API calls in `src/services/` if required

#### Backend Endpoint
1. Add method to appropriate controller
2. Update entity models if needed
3. Add migration for database changes
4. Update frontend service to call new endpoint

#### Database Changes
1. Modify `CarddPrinting.sql`
2. Update Entity Framework models
3. Add migration: `dotnet ef migrations add MigrationName`
4. Update database: `dotnet ef database update`

---

## 🔧 Configuration Files

### Frontend (`card printing UI/`)
- **`package.json`**: Dependencies, scripts, project metadata
- **`vite.config.ts`**: Build configuration, proxy settings
- **`tailwind.config.js`**: CSS framework configuration
- **`tsconfig.json`**: TypeScript compiler options
- **`eslint.config.js`**: Code linting rules

### Backend (`cardprintingAPI/`)
- **`cardprintingAPI.csproj`**: Project dependencies, framework version
- **`appsettings.json`**: Database connection, logging, CORS
- **`Program.cs`**: Application startup and middleware configuration

---

## 📊 Data Relationships

```
User_Detail (1) ──── (many) Payment
    │
    ├── (many) Contact_U
    ├── (many) Review
    └── Referenced by Card_Template (creator)

Template_Category (1) ──── (many) Card_Template

Card_Template (1) ──── (many) Review
```

---

## 🚀 API Endpoints Overview

| Controller | Method | Endpoint | Description |
|------------|--------|----------|-------------|
| UserDetail | GET | `/api/UserDetail` | Get all users |
| UserDetail | POST | `/api/UserDetail` | Create user |
| UserDetail | PUT | `/api/UserDetail/{id}` | Update user |
| UserDetail | DELETE | `/api/UserDetail/{id}` | Delete user |
| CardTemplate | GET | `/api/CardTemplate` | Get templates |
| Payment | POST | `/api/Payment` | Process payment |
| ContactU | POST | `/api/ContactU` | Send message |

---

## 📝 Key Development Patterns

### Frontend Patterns
- **Component Composition**: Reusable UI components
- **Custom Hooks**: Logic extraction for reusability
- **Context API**: Global state management
- **Service Layer**: API communication abstraction
- **Protected Routes**: Authentication-based routing

### Backend Patterns
- **Repository Pattern**: Data access abstraction (via EF Core)
- **Controller Pattern**: RESTful API endpoints
- **Dependency Injection**: Service registration in Program.cs
- **Entity Framework**: ORM for database operations
- **Async/Await**: Asynchronous programming

### Database Patterns
- **Identity Columns**: Auto-incrementing primary keys
- **Foreign Keys**: Referential integrity
- **Default Values**: Automatic timestamps
- **Check Constraints**: Data validation
- **Indexing**: Performance optimization

---

This structure provides a scalable, maintainable codebase for the business card design platform. Each layer has clear responsibilities and follows established patterns for full-stack development.
