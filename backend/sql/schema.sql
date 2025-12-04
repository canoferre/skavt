CREATE DATABASE IF NOT EXISTS `skavt_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skavt_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `search_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `location` VARCHAR(255) NULL,
  `min_price` INT NULL,
  `max_price` INT NULL,
  `min_sqm` INT NULL,
  `max_sqm` INT NULL,
  `property_type` VARCHAR(50) NULL,
  `notify_email` TINYINT(1) NOT NULL DEFAULT 0,
  `notify_telegram` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_search_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `listings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source` VARCHAR(50) NOT NULL,
  `listing_id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(500) NULL,
  `location` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `district` VARCHAR(255) NULL,
  `price_eur` INT NULL,
  `size_m2` DECIMAL(10,2) NULL,
  `url` VARCHAR(500) NOT NULL,
  `first_seen` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_source_listing` (`source`, `listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
