-- V Dental and Implant Center — MySQL schema reference
-- Run in MySQL Workbench / phpMyAdmin, or: mysql -u root -p < database/schema.sql
-- Matches tables created by database/db.js on server startup.

CREATE DATABASE IF NOT EXISTS `smilevista`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `smilevista`;

-- Patient enquiries, contact forms, site visits, booking funnel leads
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  source VARCHAR(50) NOT NULL,
  service VARCHAR(255),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  createdAt DATETIME NOT NULL
);

-- Online appointment bookings (one row per date + time slot)
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  service VARCHAR(255),
  issue TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  createdAt DATETIME NOT NULL,
  UNIQUE KEY uniq_appt_date_time (`date`, `time`)
);

-- Before & after gallery (admin uploads)
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  imageUrl TEXT NOT NULL,
  createdAt DATETIME NOT NULL
);

-- Patient reviews (pending → published/rejected in admin)
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  createdAt DATETIME NOT NULL
);

-- AI smile preview submissions (patient form + before/after images)
CREATE TABLE IF NOT EXISTS ai_previews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  beforeImageUrl TEXT NOT NULL,
  afterImageUrl TEXT,
  analysisJson TEXT,
  aiSource VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  createdAt DATETIME NOT NULL
);

-- Blog articles (admin-managed, SEO content)
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  author VARCHAR(255) NOT NULL DEFAULT 'V Dental and Implant Center',
  featuredImageUrl TEXT,
  metaTitle VARCHAR(500),
  metaDescription TEXT,
  metaKeywords VARCHAR(500),
  serviceLink VARCHAR(255),
  readTimeMinutes INT NOT NULL DEFAULT 5,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  createdAt DATETIME NOT NULL,
  publishedAt DATETIME,
  UNIQUE KEY uniq_blog_slug (slug)
);

-- If appointments existed before uniq_appt_date_time was added, run once after removing duplicate date+time rows:
-- ALTER TABLE appointments ADD UNIQUE KEY uniq_appt_date_time (`date`, `time`);
