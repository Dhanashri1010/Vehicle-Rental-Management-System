-- =====================================================================
-- PedalPal Bike Rental Platform - Database Schema
-- Version: 1.0 (MySQL 8.0+)
-- Location Scope: Pune, Maharashtra, India
-- Vehicle Scope: Motorcycles and Scooters (Petrol & Electric) - Zero Cars
-- =====================================================================

CREATE DATABASE IF NOT EXISTS pedalpal_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pedalpal_db;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS bike_images;
DROP TABLE IF EXISTS bikes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS addresses;

-- ---------------------------------------------------------------------
-- 1. ADDRESSES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    street_address VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Pune',
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_address_area_city (city, area)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. USERS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'OWNER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    driving_licence_number VARCHAR(50) NULL,
    address_id BIGINT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url VARCHAR(255) NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. BIKES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE bikes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    category ENUM('SCOOTER', 'MOTORCYCLE', 'ELECTRIC_SCOOTER', 'ELECTRIC_BIKE') NOT NULL,
    fuel_type ENUM('PETROL', 'ELECTRIC') NOT NULL,
    transmission ENUM('AUTOMATIC', 'MANUAL') NOT NULL DEFAULT 'AUTOMATIC',
    manufacturing_year INT NOT NULL CHECK (manufacturing_year >= 2015 AND manufacturing_year <= 2030),
    mileage_or_range VARCHAR(50) NOT NULL,
    seating_capacity INT NOT NULL DEFAULT 2 CHECK (seating_capacity IN (1, 2)),
    location_area VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    description TEXT NULL,
    features_json JSON NULL,
    primary_image_url VARCHAR(255) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL CHECK (price_per_hour > 0),
    price_per_day DECIMAL(10, 2) NOT NULL CHECK (price_per_day > 0),
    price_per_week DECIMAL(10, 2) NOT NULL CHECK (price_per_week > 0),
    price_per_month DECIMAL(10, 2) NULL CHECK (price_per_month > 0),
    security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 500.00 CHECK (security_deposit >= 0),
    rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    total_trips INT NOT NULL DEFAULT 0 CHECK (total_trips >= 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bike_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_bike_category (category),
    INDEX idx_bike_fuel (fuel_type),
    INDEX idx_bike_location (location_area),
    INDEX idx_bike_price_day (price_per_day),
    INDEX idx_bike_available (is_available, is_approved)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. BIKE_IMAGES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE bike_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bike_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bike_images_bike FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
    INDEX idx_bike_image_bike (bike_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. BOOKINGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(40) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    bike_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    return_datetime DATETIME NOT NULL,
    duration_hours INT NOT NULL CHECK (duration_hours > 0),
    pickup_option ENUM('SELF_PICKUP', 'DOORSTEP_DELIVERY') NOT NULL DEFAULT 'DOORSTEP_DELIVERY',
    delivery_address_id BIGINT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    rent_amount DECIMAL(10, 2) NOT NULL CHECK (rent_amount > 0),
    security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (security_deposit >= 0),
    helmet_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (helmet_fee >= 0),
    taxes DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (taxes >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
    status ENUM('REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT 'REQUESTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_dates CHECK (return_datetime > pickup_datetime),
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_bike FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_delivery_address FOREIGN KEY (delivery_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_booking_customer (customer_id),
    INDEX idx_booking_bike_dates (bike_id, pickup_datetime, return_datetime),
    INDEX idx_booking_status (status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. PAYMENTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL, -- UPI, CARD, NET_BANKING, SIMULATED
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    status ENUM('PENDING', 'PAID', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    gateway_response_json JSON NULL,
    payment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_payment_booking (booking_id),
    INDEX idx_payment_status (status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. REVIEWS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bike_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_bike FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_review_bike (bike_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'info',
    icon VARCHAR(50) NOT NULL DEFAULT 'bi-bell-fill',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id, is_read)
) ENGINE=InnoDB;

-- =====================================================================
-- INITIAL SAMPLE DATA INSERTS
-- =====================================================================

INSERT INTO addresses (id, street_address, area, city, pincode) VALUES
(1, 'Flat 302, Sai Shraddha Apts, Ideal Colony', 'Kothrud', 'Pune', '411038'),
(2, 'Shop 4, Deccan Corner, FC Road', 'Deccan Gymkhana', 'Pune', '411004'),
(3, 'Row House 12, Pancard Club Road', 'Baner', 'Pune', '411045'),
(4, 'Phase 1 Quadron Hub, Near Megapolis', 'Hinjewadi', 'Pune', '411057'),
(5, 'Plot 88, Viman Nagar Central', 'Viman Nagar', 'Pune', '411014');

INSERT INTO users (id, full_name, email, phone_number, password_hash, role, driving_licence_number, address_id, is_verified, avatar_url) VALUES
(1, 'Rahul Patil', 'rahul.patil@gmail.com', '9876543210', '$2a$12$e8Y5M59j.hashed.demo', 'CUSTOMER', 'MH12-2021004921', 1, TRUE, 'images/avatars/user-rahul.svg'),
(2, 'Suresh Deshmukh', 'suresh.bikes@gmail.com', '9822012345', '$2a$12$e8Y5M59j.hashed.demo', 'OWNER', 'MH12-1998001234', 1, TRUE, 'images/avatars/user-suresh.svg'),
(3, 'PedalPal Admin', 'admin@pedalpal.in', '9999900000', '$2a$12$e8Y5M59j.hashed.admin', 'ADMIN', NULL, 2, TRUE, 'images/avatars/admin.svg'),
(4, 'Vikram Shinde', 'vikram.rides@gmail.com', '9881176543', '$2a$12$e8Y5M59j.hashed.demo', 'OWNER', 'MH12-2005004321', 2, TRUE, 'images/avatars/avatar-o2.svg'),
(5, 'Aditya Joshi', 'aditya.joshi@outlook.com', '9765432109', '$2a$12$e8Y5M59j.hashed.demo', 'CUSTOMER', 'MH12-2020008765', 4, TRUE, 'images/avatars/avatar-c3.svg');

INSERT INTO bikes (id, owner_id, name, brand, model, registration_number, category, fuel_type, transmission, manufacturing_year, mileage_or_range, seating_capacity, location_area, pincode, description, primary_image_url, price_per_hour, price_per_day, price_per_week, security_deposit, rating, review_count, total_trips, is_available, is_approved) VALUES
(1, 2, 'Honda Activa 6G', 'Honda', 'Activa 6G Standard', 'MH-12-AK-4512', 'SCOOTER', 'PETROL', 'AUTOMATIC', 2023, '45 km/l', 2, 'Kothrud', '411038', 'Pune most trusted scooter for office, college and errands.', 'images/bikes/honda-activa-6g.svg', 40.00, 299.00, 1799.00, 500.00, 4.90, 94, 142, TRUE, TRUE),
(2, 4, 'Royal Enfield Classic 350', 'Royal Enfield', 'Classic 350 Reborn', 'MH-12-CR-8921', 'MOTORCYCLE', 'PETROL', 'MANUAL', 2023, '35 km/l', 2, 'Deccan Gymkhana', '411004', 'King of highway roads with signature Royal Enfield thump.', 'images/bikes/re-classic-350.svg', 90.00, 699.00, 4199.00, 1500.00, 4.90, 128, 180, TRUE, TRUE);

INSERT INTO bookings (id, booking_reference, customer_id, bike_id, owner_id, pickup_datetime, return_datetime, duration_hours, pickup_option, delivery_fee, rent_amount, security_deposit, helmet_fee, taxes, total_amount, status) VALUES
(1, 'BK-90124', 1, 1, 2, '2026-11-21 09:00:00', '2026-11-22 09:00:00', 24, 'DOORSTEP_DELIVERY', 0.00, 299.00, 500.00, 0.00, 35.00, 834.00, 'ONGOING');

INSERT INTO payments (id, booking_id, transaction_reference, payment_method, amount, status) VALUES
(1, 1, 'TXN-UPI-90124', 'UPI (Google Pay)', 834.00, 'PAID');

INSERT INTO reviews (id, bike_id, customer_id, rating, comment) VALUES
(1, 1, 1, 5, 'The Activa was spotless and delivered right on time at Kothrud. Sanitized helmet provided.');

INSERT INTO notifications (id, user_id, title, message, type, icon, is_read) VALUES
(1, 1, 'Active Ride in Progress', 'Your ride with Honda Activa 6G is ongoing. Return is tomorrow 9:00 AM.', 'primary', 'bi-bicycle', FALSE);
