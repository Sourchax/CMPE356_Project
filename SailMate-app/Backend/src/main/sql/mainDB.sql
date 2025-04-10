-- Drop and recreate the database
DROP DATABASE IF EXISTS SAILMATE;
CREATE DATABASE SAILMATE;

USE SAILMATE;

-- Create tables
CREATE TABLE station (
    id INT AUTO_INCREMENT,
    city VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    personnel VARCHAR(255) NOT NULL,
    phoneno VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    full_name VARCHAR(255),
    user_role VARCHAR(50) DEFAULT 'user',
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_activity_action ON activity_log(action_type);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_date ON activity_log(created_at);

CREATE TABLE notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type ENUM('TICKET_CREATED', 'TICKET_UPDATED', 'VOYAGE_CANCELLED', 'VOYAGE_DELAYED', 'PRICE_CHANGED', 'SYSTEM', 'BROADCAST') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_id VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_read (is_read),
    INDEX idx_notification_type (type),
    INDEX idx_notification_entity (entity_id),
    INDEX idx_notification_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE voyages (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    from_station INTEGER NOT NULL,
    to_station INTEGER NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    status ENUM('active', 'cancel') NOT NULL DEFAULT 'active',
    ship_type VARCHAR(255) NOT NULL,
    fuel_type BOOLEAN DEFAULT false,
    business_seats BIGINT UNSIGNED,
    promo_seats BIGINT UNSIGNED,
    economy_seats BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    
    -- Foreign keys to stations
    FOREIGN KEY (from_station) REFERENCES station(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (to_station) REFERENCES station(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE seats_sold (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voyage_id INT NOT NULL UNIQUE,
    ship_type VARCHAR(255) NOT NULL,
    upper_deck_promo BIGINT DEFAULT 0,
    upper_deck_economy BIGINT DEFAULT 0,
    upper_deck_business BIGINT DEFAULT 0,
    lower_deck_promo BIGINT DEFAULT 0,
    lower_deck_economy BIGINT DEFAULT 0,
    lower_deck_business BIGINT DEFAULT 0,
    total_tickets_sold BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (voyage_id) REFERENCES voyages(id) ON DELETE CASCADE,
    INDEX idx_seats_voyage (voyage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets table with snake_case naming
CREATE TABLE tickets (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    ticket_id VARCHAR(32) NOT NULL UNIQUE,
    voyage_id INTEGER,
    passenger_count INT UNSIGNED NOT NULL,
    total_price INTEGER UNSIGNED NOT NULL,
    ticket_class VARCHAR(50) NOT NULL,
    selected_seats VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    ticket_data JSON NOT NULL COMMENT 'Stores passenger information including name, surname, birthDate, email, phoneNo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    
    -- Foreign key to voyages table
    FOREIGN KEY (voyage_id) REFERENCES voyages(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_ticket_voyage ON tickets(voyage_id);
CREATE INDEX idx_ticket_class ON tickets(ticket_class);
CREATE INDEX idx_ticket_user ON tickets(user_id);

CREATE TABLE announcement (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    image LONGBLOB NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE complaint (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    reply TEXT,
    status ENUM('active', 'solved') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prices (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    class VARCHAR(255) NOT NULL,
    value DOUBLE NOT NULL,
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_voyage_date ON voyages(departure_date);
CREATE INDEX idx_voyage_status ON voyages(status);
CREATE INDEX idx_voyage_stations ON voyages(from_station, to_station);

-- Insert station data
INSERT INTO station (city, title, personnel, phoneno, address)
VALUES
    ('İzmir', 'İzmir Marina', 'Ali Kaya', '+90 232 123 4567', 'Bahçelerarası, 35330 Balçova/İzmir, Turkey'),
    ('İstanbul', 'Yenikapı Terminal', 'Mehmet Yılmaz', '+90 212 987 6543', 'Katip Kasım, Kennedy Cad., 34131 Fatih/İstanbul, Turkey'),
    ('Bursa', 'Mudanya Hub', 'Zeynep Demir', '+90 224 321 7654', 'Güzelyalı Eğitim, 16940 Mudanya/Bursa, Turkey'),
    ('İzmir', 'Foça Station', 'Fatma Aydın', '+90 232 555 7890', 'Aşıklar Cd., 35680 Foça/İzmir, Turkey'),
    ('İstanbul', 'Kadıköy Station', 'Hasan Koç', '+90 212 888 1122', 'Caferağa, 34710 Kadıköy/İstanbul, Turkey');

-- Insert some ticket data
INSERT INTO prices (class, value)
VALUES
    ('Promo', 400),
    ('Economy', 500),
    ('Business', 800),
    ('Fee', 10),
    ('Senior', 15),
    ('Student', 20);