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

-- Insert example voyages directly
-- İzmir to İstanbul routes
INSERT INTO voyages (from_station, to_station, departure_date, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats)
VALUES
    (1, 2, CURDATE(), '08:00:00', '12:30:00', 'Large Ferry', false, 50, 20, 200),
    (1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:30:00', 'Large Ferry', false, 50, 20, 200),
    (1, 2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '08:00:00', '12:30:00', 'Large Ferry', false, 50, 20, 200);

-- İstanbul to İzmir routes
INSERT INTO voyages (from_station, to_station, departure_date, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats)
VALUES
    (2, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '13:30:00', 'Large Ferry', false, 50, 20, 200),
    (2, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', '13:30:00', 'Large Ferry', false, 50, 20, 200),
    (2, 1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '09:00:00', '13:30:00', 'Large Ferry', false, 50, 20, 200);

-- İzmir to Bursa routes
INSERT INTO voyages (from_station, to_station, departure_date, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats)
VALUES
    (1, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00:00', '10:30:00', 'Fast Ferry', true, 30, 10, 100),
    (1, 3, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '07:00:00', '10:30:00', 'Fast Ferry', true, 30, 10, 100);

-- Bursa to İzmir routes
INSERT INTO voyages (from_station, to_station, departure_date, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats)
VALUES
    (3, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', '19:30:00', 'Fast Ferry', true, 30, 10, 100),
    (3, 1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '16:00:00', '19:30:00', 'Fast Ferry', true, 30, 10, 100);

-- İstanbul to Foça routes
INSERT INTO voyages (from_station, to_station, departure_date, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats)
VALUES
    (2, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:30:00', '13:00:00', 'Fast Ferry', true, 30, 10, 100),
    (2, 4, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '07:30:00', '13:00:00', 'Fast Ferry', true, 30, 10, 100);

-- Foça to İstanbul routes
INSERT INTO voyages (from_station, to_station, departure_date, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats)
VALUES
    (4, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '19:30:00', 'Fast Ferry', true, 30, 10, 100),
    (4, 2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '14:00:00', '19:30:00', 'Fast Ferry', true, 30, 10, 100);

-- Initialize seats_sold records for voyages
INSERT INTO seats_sold (voyage_id, ship_type, upper_deck_promo, upper_deck_economy, upper_deck_business, lower_deck_promo, lower_deck_economy, lower_deck_business, total_tickets_sold)
SELECT id, ship_type, 0, 0, 0, 0, 0, 0, 0 FROM voyages;

-- Insert some ticket data
INSERT INTO tickets (ticket_id, voyage_id, passenger_count, total_price, ticket_class, selected_seats, user_id, ticket_data)
VALUES
    ('TKT-12345678', 1, 2, 1000, 'Economy', 'E12,E13', 'user123', '{"passengers":[{"name":"John","surname":"Doe","birthDate":"1985-06-15","email":"john.doe@example.com","phoneNo":"+90 555 123 4567"},{"name":"Jane","surname":"Doe","birthDate":"1988-08-22","email":"jane.doe@example.com","phoneNo":"+90 555 765 4321"}]}'),
    ('TKT-23456789', 1, 1, 800, 'Business', 'B5', 'user456', '{"passengers":[{"name":"Ali","surname":"Yilmaz","birthDate":"1975-03-10","email":"ali.yilmaz@example.com","phoneNo":"+90 532 111 2222"}]}'),
    ('TKT-34567890', 4, 3, 1500, 'Economy', 'E22,E23,E24', 'user789', '{"passengers":[{"name":"Mehmet","surname":"Kaya","birthDate":"1982-11-28","email":"mehmet.kaya@example.com","phoneNo":"+90 533 333 4444"},{"name":"Ayşe","surname":"Kaya","birthDate":"1984-07-12","email":"ayse.kaya@example.com","phoneNo":"+90 533 555 6666"},{"name":"Zeynep","surname":"Kaya","birthDate":"2012-02-05","email":"","phoneNo":""}]}');

-- Update the seats_sold counts based on tickets sold
UPDATE seats_sold SET 
    lower_deck_economy = 2, 
    total_tickets_sold = 2 
WHERE voyage_id = 1;

UPDATE seats_sold SET 
    upper_deck_business = 1, 
    total_tickets_sold = 1 
WHERE voyage_id = 1;

UPDATE seats_sold SET 
    lower_deck_economy = 3, 
    total_tickets_sold = 3 
WHERE voyage_id = 4;

INSERT INTO prices (class, value)
VALUES
    ('Promo', 400),
    ('Economy', 500),
    ('Business', 800),
    ('Fee', 10),
    ('Senior', 15),
    ('Student', 20);

-- Insert some complaints
INSERT INTO complaint (user_id, sender, email, subject, message)
VALUES
    ('user123', 'Ali Yilmaz', 'ali.yilmaz@example.com', 'Delay on Monday Ferry', 'The ferry on Monday was delayed by 30 minutes without any announcement. I almost missed my connection.'),
    ('user456', 'Fatma Demir', 'fatma.demir@example.com', 'Cleanliness Issue', 'The restrooms on the ferry were not in good condition during my journey on Tuesday.');

-- Insert notifications
INSERT INTO notification (user_id, type, title, message, entity_id, is_read)
VALUES
    ('user123', 'TICKET_CREATED', 'Ticket Confirmation', 'Your ticket TKT-12345678 has been confirmed. Thank you for choosing SailMate!', 'TKT-12345678', false),
    ('user456', 'TICKET_CREATED', 'Ticket Confirmation', 'Your ticket TKT-23456789 has been confirmed. Thank you for choosing SailMate!', 'TKT-23456789', true),
    ('user789', 'TICKET_CREATED', 'Ticket Confirmation', 'Your ticket TKT-34567890 has been confirmed. Thank you for choosing SailMate!', 'TKT-34567890', false),
    ('user123', 'VOYAGE_DELAYED', 'Voyage Delay Notice', 'Your voyage from İzmir Marina to Yenikapı Terminal on today has been delayed by 30 minutes.', 'TKT-12345678', false);