-- All the query 

-- Create database
CREATE DATABASE IF NOT EXISTS sitebuilder;
USE sitebuilder;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- user table edits for password reset
ALTER TABLE users
ADD COLUMN resetToken VARCHAR(255),
ADD COLUMN resetTokenExpire DATETIME;





---------------------------------------------------------------
-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  business_name VARCHAR(255),
  tagline TEXT,
  logo_url TEXT,
  about TEXT,
  contact_info JSON,
  services JSON,
  gallery JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

---------------------------------------------------------------------------

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(255),
  content TEXT,
  image_url TEXT,
  gmb_posted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

------------------------------------------------------------------------

-- GMB Tokens table
CREATE TABLE IF NOT EXISTS gmb_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at DATETIME,
  gmb_email VARCHAR(150),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




