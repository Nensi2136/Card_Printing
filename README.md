# CardCraft - Professional Business Card Design Platform

<div align="center">

![CardCraft Logo](card%20printing%20UI/public/image.png)

**Create stunning business cards in minutes with our intuitive design platform**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8.0-purple.svg)](https://docs.microsoft.com/en-us/aspnet/core/)
[![Entity Framework](https://img.shields.io/badge/Entity_Framework_Core-9.0-green.svg)](https://docs.microsoft.com/en-us/ef/core/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-red.svg)](https://www.microsoft.com/en-us/sql-server)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

[Live Demo](#) • [Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [📊 Admin Panel](#-admin-panel)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🙋‍♂️ Support](#️-support)

---

## 🎯 Overview

**CardCraft** is a comprehensive business card design and printing platform that empowers professionals and businesses to create stunning, professional business cards in minutes. Our platform combines an intuitive React-based frontend with a robust ASP.NET Core API backend, offering both free and premium features for users of all skill levels.

### 🎨 What Makes CardCraft Special

- **500+ Professional Templates** across multiple categories
- **Real-time Preview** with instant PDF generation
- **Premium & Free Tiers** with advanced customization options
- **Admin Dashboard** for comprehensive platform management
- **Secure Payment Processing** with transaction tracking
- **Responsive Design** that works on all devices

---

## ✨ Features

### 👤 User Features
- 🔐 **Secure Authentication** - User registration and login
- 🎨 **Template Gallery** - Browse 500+ professional templates
- 🖌️ **Live Customization** - Real-time card preview and editing
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💳 **Premium Upgrades** - Unlock advanced features and templates
- 💰 **Payment Integration** - Secure payment processing
- 📄 **PDF Export** - Instant high-quality PDF downloads
- 📞 **Contact Support** - Direct messaging to administrators

### 👑 Premium Features
- 🎯 **Advanced Templates** - Access to premium template collection
- 🎨 **Custom Branding** - Unlimited color schemes and fonts
- 📊 **Usage Analytics** - Track your design activity
- 🎪 **Priority Support** - Fast-track customer service
- 📈 **Bulk Operations** - Create multiple cards at once

### 👨‍💼 Admin Features
- 📊 **Comprehensive Dashboard** - Real-time platform statistics
- 👥 **User Management** - View, edit, and manage user accounts
- 🎨 **Template Management** - Add, edit, and categorize templates
- 💰 **Payment Monitoring** - Track all transactions and revenue
- 📬 **Contact Management** - Handle customer inquiries
- 📈 **Analytics & Reporting** - Generate detailed reports
- 🏷️ **Category Management** - Organize templates by categories

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  ASP.NET Core   │    │   SQL Server    │
│   (Vite + TS)   │◄──►│    API (.NET 8) │◄──►│     Database    │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • User_Detail   │
│ • Pages         │    │ • Models        │    │ • Card_Template │
│ • Services      │    │ • Services      │    │ • Payment       │
│ • Context       │    │ • EF Core       │    │ • Template_     │
└─────────────────┘    └─────────────────┘    │   _Category    │
                                              │ • Contact_U     │
                                              │ • Review        │
                                              └─────────────────┘
```

### 🔄 Data Flow
1. **User Interaction** → React Components
2. **API Calls** → Axios HTTP Client
3. **Business Logic** → ASP.NET Core Controllers
4. **Data Access** → Entity Framework Core
5. **Database** → SQL Server Operations

---

## 🚀 Quick Start

### Prerequisites Checklist

Before you begin, ensure you have the following installed:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ **SQL Server** (Express or Developer Edition) - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- ✅ **Visual Studio 2022** (or VS Code with C# extensions)
- ✅ **Git** - [Download](https://git-scm.com/)

### ⚡ One-Command Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cardcraft.git
cd cardcraft

# Setup backend
cd cardprintingAPI
dotnet restore
# Configure database connection in appsettings.json

# Setup frontend
cd ../card\ printing\ UI
npm install

# Run database setup
# Execute CarddPrinting.sql in SQL Server

# Start the application
# Terminal 1: Backend
cd cardprintingAPI
dotnet run

# Terminal 2: Frontend
cd ../card\ printing\ UI
npm run dev
```

---

## 📋 Prerequisites

### System Requirements
- **OS**: Windows 10/11, macOS 12+, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 5GB free space
- **Network**: Stable internet connection for package downloads

### Development Tools
```bash
# Verify installations
node --version      # Should be v18+
dotnet --version    # Should be 8.0+
sqlcmd -?          # SQL Server command-line tool
```

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cardcraft.git
cd cardcraft
```

### 2. Database Setup
```sql
-- Open SQL Server Management Studio or Azure Data Studio
-- Execute the CarddPrinting.sql script to create database and tables
-- Note the connection string for the next step
```

### 3. Backend Configuration
```bash
cd cardprintingAPI

# Restore NuGet packages
dotnet restore

# Update connection string in appsettings.json
# Default: Server=localhost\\SQLEXPRESS;Database=CardPrintingDB;Trusted_Connection=True;
```

### 4. Frontend Setup
```bash
cd "../card printing UI"

# Install dependencies
npm install

# Create environment file (optional)
echo "VITE_API_BASE_URL=https://localhost:7090/api" > .env.local
```

---

## 🔧 Configuration

### Backend Configuration (`cardprintingAPI/appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CardPrintingDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend Configuration (`.env.local`)
```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7090/api

# Optional: Development settings
VITE_APP_NAME=CardCraft
VITE_APP_VERSION=1.0.0
```

### CORS Configuration
The API is configured to allow requests from the React development server. For production deployment, update the CORS policy in `Program.cs` to allow your frontend domain.

---

## 🏃‍♂️ Running the Application

### Development Mode

#### Terminal 1: Start the Backend API
```bash
cd cardprintingAPI
dotnet run
```
- API will be available at: `https://localhost:7090`
- Swagger documentation: `https://localhost:7090/swagger`

#### Terminal 2: Start the Frontend
```bash
cd "card printing UI"
npm run dev
```
- Frontend will be available at: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin/login`

### Production Build

#### Backend
```bash
cd cardprintingAPI
dotnet publish -c Release -o ./publish
dotnet ./publish/cardprintingAPI.dll
```

#### Frontend
```bash
cd "card printing UI"
npm run build
npm run preview  # For testing the build locally
```

---

## 📊 Admin Panel

### Accessing Admin Features
1. Navigate to `/admin/login`
2. Use admin credentials (created during database setup)
3. Access the dashboard at `/admin/dashboard`

### Admin Capabilities
- **📈 Dashboard Analytics** - Real-time platform statistics
- **👥 User Management** - View and manage all user accounts
- **🎨 Template Management** - Add, edit, and organize templates
- **💰 Payment Tracking** - Monitor all transactions
- **📬 Contact Management** - Handle customer inquiries
- **📊 Report Generation** - Download detailed PDF reports

### Default Admin Account
```
Username: admin
Password: Admin123! (or as configured in database)
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI framework with hooks
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 6.3.5** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router 7.6.3** - Client-side routing
- **Axios 1.11.0** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **html2canvas 1.4.1** & **jsPDF 3.0.1** - PDF generation

### Backend
- **ASP.NET Core 8.0** - Cross-platform web framework
- **Entity Framework Core 9.0.11** - ORM for data access
- **SQL Server** - Relational database
- **Newtonsoft.Json 13.0.3** - JSON serialization
- **Swashbuckle.AspNetCore 6.6.2** - API documentation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **TypeScript Compiler** - Type checking

---

## 📁 Project Structure

```
D:\AAD\Card_Printing\
├── card printing UI\              # React Frontend
│   ├── public\
│   │   └── image.png             # App logo/icon
│   ├── src\
│   │   ├── components\           # Reusable UI components
│   │   │   ├── admin\           # Admin-specific components
│   │   │   ├── CardPreview.tsx  # Card preview component
│   │   │   ├── Footer.tsx       # Site footer
│   │   │   ├── Header.tsx       # Site header
│   │   │   └── PaymentModal.tsx # Payment processing modal
│   │   ├── context\             # React context providers
│   │   │   └── AppContext.tsx   # Global app state
│   │   ├── hooks\               # Custom React hooks
│   │   ├── pages\               # Page components
│   │   │   ├── admin\           # Admin dashboard pages
│   │   │   ├── About.tsx        # About page
│   │   │   ├── Contact.tsx      # Contact page
│   │   │   ├── Customize.tsx    # Card customization
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── Login.tsx        # User login
│   │   │   ├── Product.tsx      # Product showcase
│   │   │   ├── Register.tsx     # User registration
│   │   │   └── Upgrade.tsx      # Premium upgrade
│   │   ├── services\            # API service functions
│   │   ├── types\               # TypeScript type definitions
│   │   └── main.tsx             # App entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── cardprintingAPI\              # ASP.NET Core Backend
│   ├── Controllers\             # API endpoint controllers
│   │   ├── CardTemplateController.cs
│   │   ├── ContactUController.cs
│   │   ├── PaymentController.cs
│   │   ├── ReviewController.cs
│   │   ├── TemplateCategoryController.cs
│   │   └── UserDetailController.cs
│   ├── Models\                  # Entity Framework models
│   │   ├── CardPrintingDbContext.cs
│   │   ├── CardTemplate.cs
│   │   ├── ContactU.cs
│   │   ├── Payment.cs
│   │   ├── Review.cs
│   │   ├── TemplateCategory.cs
│   │   └── UserDetail.cs
│   ├── appsettings.json
│   ├── Program.cs               # Application entry point
│   └── cardprintingAPI.csproj
├── template\                    # Card template images
├── CarddPrinting.sql            # Database schema
├── CONNECTING_API_REACT_DOTNET8.md  # Setup documentation
└── README.md                    # This file
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/cardcraft.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes and test thoroughly
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to the branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Areas for Contribution
- 🐛 **Bug Fixes** - Help us squash bugs
- ✨ **New Features** - Add new templates or functionality
- 🎨 **UI/UX Improvements** - Enhance the user experience
- 📚 **Documentation** - Improve guides and documentation
- 🧪 **Testing** - Add unit and integration tests

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial Use** - You can use this commercially
- ✅ **Modification** - You can modify the code
- ✅ **Distribution** - You can distribute copies
- ✅ **Private Use** - You can use privately
- ❌ **Liability** - No liability from the authors
- ❌ **Warranty** - No warranty provided

---

## 🙋‍♂️ Support

### Getting Help
- 📧 **Email**: support@cardcraft.com
- 💬 **Discord**: [Join our community](https://discord.gg/cardcraft)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/cardcraft/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/cardcraft/wiki)

### Troubleshooting
- **API Connection Issues**: Check CORS settings and API URL configuration
- **Database Errors**: Verify SQL Server connection string
- **Build Errors**: Ensure all dependencies are installed correctly
- **Authentication Issues**: Check user credentials and JWT token validity

### Feature Requests
Have an idea for CardCraft? We'd love to hear it!
- Create a [GitHub Issue](https://github.com/yourusername/cardcraft/issues) with the "enhancement" label
- Describe your feature request in detail
- Include mockups or examples if possible

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Microsoft** - For ASP.NET Core and Entity Framework
- **Tailwind Labs** - For the incredible Tailwind CSS framework
- **Our Community** - For bug reports, feature requests, and contributions
- **Designers** - For the beautiful card templates

---

<div align="center">

**Made with ❤️ by the CardCraft Team**

[⭐ Star us on GitHub](https://github.com/yourusername/cardcraft) • [🐛 Report a Bug](https://github.com/yourusername/cardcraft/issues) • [💡 Request a Feature](https://github.com/yourusername/cardcraft/issues)

</div>
