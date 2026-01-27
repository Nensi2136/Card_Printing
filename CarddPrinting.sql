CREATE DATABASE CardPrintingDB
-- User table
CREATE TABLE User_Detail (
    User_Id int PRIMARY KEY IDENTITY(1,1) ,
    Username varchar(10) NOT NULL UNIQUE,
    Email nvarchar(50) NOT NULL UNIQUE,
    Password_hash nvarchar(60) NOT NULL unique,
    Is_premium BIT NOT NULL DEFAULT 0,
    Is_admin BIT NOT NULL DEFAULT 0,
    Created_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_at Datetime
);

-- Template category table
CREATE TABLE Template_Category (
    Category_Id int IDENTITY(1,1) PRIMARY KEY,
    Category_Name varchar(60) NOT NULL UNIQUE,
    Category_Description varchar(max),
	Created_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_at Datetime NOT NULL
);

-- Card template table
CREATE TABLE Card_Template (
    Template_Id int IDENTITY(1,1) PRIMARY KEY,
    Category_Id int NOT NULL REFERENCES Template_Category(Category_Id),
    Title varchar(50) NOT NULL,
    Card_Template_Description varchar(max),
    File_Path nvarchar(max) NOT NULL,
    Is_premium BIT NOT NULL DEFAULT 0,
    Created_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_at Datetime NOT NULL
);

-- Payment
CREATE TABLE Payment (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    User_id INT NOT NULL REFERENCES User_Detail(user_id),
    Acount_Number BIGINT NOT NULL,
    CVV_Number BIGINT NOT NULL,
    Card_Expiry_Date NVARCHAR(10) NOT NULL,
    Amount FLOAT NOT NULL,
    Payment_Date DATETIME NOT NULL
);

-- Review table
CREATE TABLE Review (
    Review_Id int PRIMARY KEY IDENTITY(1,1),
    User_Id int NOT NULL REFERENCES User_Detail(User_Id),
    Template_Id int NOT NULL REFERENCES Card_Template(Template_Id),
    Rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
    Comment varchar(max),
    Created_At DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Contact us table
CREATE TABLE Contact_Us (
    Contact_Id int IDENTITY(1,1) PRIMARY KEY,
    User_Id int REFERENCES User_Detail(User_Id),
    Name varchar(50) NOT NULL,
    Email nvarchar(80) NOT NULL,
    Message varchar(max) NOT NULL,
    Created_at DATETIME NOT NULL
);
