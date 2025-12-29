-- =====================================================
-- ProHand Complete Database Setup Script
-- =====================================================

-- Drop existing tables if they exist (use with caution in production)
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS services;
-- DROP TABLE IF EXISTS users;

-- =====================================================
-- 1. USERS TABLE (Customers, Providers, Admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    service_category VARCHAR(100) NULL,
    role ENUM('customer', 'provider', 'admin') DEFAULT 'customer',
    is_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    provider_id INT(11) NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    thumbnail VARCHAR(255) NULL,
    provider_name VARCHAR(100) NULL,
    provider_email VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NOT NULL,
    service_id INT(11) NOT NULL,
    offered_price DECIMAL(10,2) NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. INSERT DEFAULT ADMIN ACCOUNT
-- =====================================================
-- Password: admin123
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('System Admin', 'admin@prohand.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1)
ON DUPLICATE KEY UPDATE role='admin';

-- =====================================================
-- 5. INSERT SAMPLE PROVIDER ACCOUNTS
-- =====================================================
-- Provider 1: Electrician (Password: provider123)
INSERT INTO users (name, email, password, phone, address, service_category, role, is_verified) 
VALUES ('John Electrician', 'john@provider.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01712345678', 'Dhaka, Bangladesh', 'Electrician', 'provider', 1)
ON DUPLICATE KEY UPDATE role='provider';

-- Provider 2: Plumber (Password: provider123)
INSERT INTO users (name, email, password, phone, address, service_category, role, is_verified) 
VALUES ('Mike Plumber', 'mike@provider.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01812345679', 'Chittagong, Bangladesh', 'Plumber', 'provider', 1)
ON DUPLICATE KEY UPDATE role='provider';

-- Provider 3: Pending Approval (Password: provider123)
INSERT INTO users (name, email, password, phone, address, service_category, role, is_verified) 
VALUES ('Sarah Cleaner', 'sarah@provider.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01912345680', 'Sylhet, Bangladesh', 'Cleaner', 'provider', 0)
ON DUPLICATE KEY UPDATE role='provider';

-- =====================================================
-- 6. INSERT SAMPLE CUSTOMER ACCOUNTS
-- =====================================================
-- Customer 1 (Password: customer123)
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('Alice Customer', 'alice@customer.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 1)
ON DUPLICATE KEY UPDATE role='customer';

-- Customer 2 (Password: customer123)
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('Bob Customer', 'bob@customer.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 1)
ON DUPLICATE KEY UPDATE role='customer';

-- =====================================================
-- 7. INSERT SAMPLE SERVICES
-- =====================================================
-- Get provider IDs (assuming they were just inserted)
SET @provider1_id = (SELECT id FROM users WHERE email='john@provider.com');
SET @provider2_id = (SELECT id FROM users WHERE email='mike@provider.com');

INSERT INTO services (provider_id, title, category, description, price, thumbnail, provider_name, provider_email) 
VALUES 
(@provider1_id, 'Electrical Wiring Installation', 'Electrician', 'Professional electrical wiring for homes and offices', 150.00, '../images/Services/Electrical Wiring.jpg', 'John Electrician', 'john@provider.com'),
(@provider1_id, 'AC Installation & Repair', 'Electrician', 'Expert AC installation and maintenance services', 200.00, '../images/Services/Ac Installation.webp', 'John Electrician', 'john@provider.com'),
(@provider2_id, 'Plumbing Repair Services', 'Plumber', 'Fix leaks, install pipes, and drainage solutions', 100.00, '../images/Services/Plumbing.jpg', 'Mike Plumber', 'mike@provider.com'),
(@provider2_id, 'Bathroom Renovation', 'Plumber', 'Complete bathroom plumbing renovation', 500.00, '../images/Services/Bathroom.jpg', 'Mike Plumber', 'mike@provider.com');

-- =====================================================
-- 8. INSERT SAMPLE BOOKINGS
-- =====================================================
SET @customer1_id = (SELECT id FROM users WHERE email='alice@customer.com');
SET @customer2_id = (SELECT id FROM users WHERE email='bob@customer.com');
SET @service1_id = (SELECT id FROM services WHERE title='Electrical Wiring Installation');
SET @service2_id = (SELECT id FROM services WHERE title='Plumbing Repair Services');

INSERT INTO bookings (user_id, service_id, offered_price, booking_date, status, notes) 
VALUES 
(@customer1_id, @service1_id, 150.00, '2025-01-05', 'pending', 'Need urgent electrical work'),
(@customer2_id, @service2_id, 100.00, '2025-01-08', 'accepted', 'Kitchen sink leaking'),
(@customer1_id, @service2_id, 100.00, '2025-01-10', 'completed', 'Bathroom pipe fixed');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT 'Users Table:' as Info;
SELECT id, name, email, role, is_verified FROM users;

SELECT 'Services Table:' as Info;
SELECT id, title, category, price, provider_name FROM services;

SELECT 'Bookings Table:' as Info;
SELECT b.id, u.name as customer, s.title as service, b.booking_date, b.status 
FROM bookings b 
JOIN users u ON b.user_id = u.id 
JOIN services s ON b.service_id = s.id;
