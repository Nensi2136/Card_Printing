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
INSERT INTO Payment (User_id, Acount_Number, CVV_Number, Card_Expiry_Date, Amount, Payment_Date)
VALUES (1, 1234567890123456, 123, '12/2027', 99.99, '2025-09-03 12:00:00');


-- Review table
CREATE TABLE Review (
    Review_Id int PRIMARY KEY IDENTITY(1,1),
    User_Id int NOT NULL REFERENCES User_Detail(User_Id),
    Template_Id int NOT NULL REFERENCES Card_Template(Template_Id),
    Rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
    Comment varchar(max),
    Created_At DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into Review table
INSERT INTO Review (User_Id, Template_Id, Rating, Comment)
VALUES 
(1, 1, 4, 'Excellent template! Very useful for my design.'),

(2, 1, 3, 'Good template but needs a bit more customization options.');


-- Contact us table
CREATE TABLE Contact_Us (
    Contact_Id int IDENTITY(1,1) PRIMARY KEY,
    User_Id int REFERENCES User_Detail(User_Id),
    Name varchar(50) NOT NULL,
    Email nvarchar(80) NOT NULL,
    Message varchar(max) NOT NULL,
    Created_at DATETIME NOT NULL
);

select* from User_Detail
INSERT INTO User_Detail (Username, Email, Password_hash, Is_premium, Is_admin)
VALUES 
('john_doe', 'john@example.com', 'hashed_password_1', 1, 0);

INSERT INTO User_Detail (Username, Email, Password_hash, Is_premium, Is_admin)
VALUES 
('admin01', 'admin@example.com', 'hashed_password_2', 0, 1);
