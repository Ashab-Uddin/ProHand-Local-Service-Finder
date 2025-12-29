-- ProHand Complete Database Setup
-- Execute this in phpMyAdmin or MySQL command line

USE prohand_db;

-- 1. Update Users Table Structure
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL AFTER password,
ADD COLUMN IF NOT EXISTS address TEXT NULL AFTER phone,
ADD COLUMN IF NOT EXISTS service_category VARCHAR(100) NULL AFTER address,
ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 0 AFTER service_category;

-- 2. Update role enum
ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'provider', 'admin') DEFAULT 'customer';

-- 3. Update bookings status enum
ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending';

-- 4. Add notes column to bookings if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT NULL AFTER status;

-- 5. Insert Admin Account (Password: admin123)
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('System Admin', 'admin@prohand.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1)
ON DUPLICATE KEY UPDATE role='admin', is_verified=1;

-- 6. Insert Sample Providers
INSERT INTO users (name, email, password, phone, address, service_category, role, is_verified) VALUES
('John Electrician', 'john@provider.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01712345678', 'Dhaka, Bangladesh', 'Electrician', 'provider', 1),
('Mike Plumber', 'mike@provider.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01812345679', 'Chittagong, Bangladesh', 'Plumber', 'provider', 1),
('Sarah Cleaner', 'sarah@provider.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01912345680', 'Sylhet, Bangladesh', 'Cleaner', 'provider', 0)
ON DUPLICATE KEY UPDATE role='provider';

-- 7. Insert Sample Customers
INSERT INTO users (name, email, password, role, is_verified) VALUES
('Alice Customer', 'alice@customer.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 1),
('Bob Customer', 'bob@customer.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 1)
ON DUPLICATE KEY UPDATE role='customer';

-- Verification
SELECT 'Setup Complete!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Providers FROM users WHERE role='provider';
SELECT COUNT(*) as Total_Services FROM services;
SELECT COUNT(*) as Total_Bookings FROM bookings;
