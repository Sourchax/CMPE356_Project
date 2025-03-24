DROP DATABASE SAILMATE;

CREATE DATABASE SAILMATE;

USE SAILMATE;

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

CREATE TABLE voyages (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    from_station INTEGER NOT NULL,
    to_station INTEGER NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    status ENUM('active', 'cancel', 'delete') NOT NULL DEFAULT 'active',
    ship_type VARCHAR(255) NOT NULL,
    fuel_type BOOLEAN DEFAULT false,
    business_seats BIGINT UNSIGNED,
    promo_seats BIGINT UNSIGNED,
    economy_seats BIGINT UNSIGNED,
    PRIMARY KEY(`id`),
    
    -- Cascade updates/deletions on referenced Station
    FOREIGN KEY (from_station) REFERENCES Station(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (to_station) REFERENCES Station(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tickets (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    TicketID VARCHAR(32) NOT NULL UNIQUE,
    voyage_id INTEGER,
    total_price INTEGER UNSIGNED NOT NULL,
    purchaser_name VARCHAR(255) NOT NULL,
    barcode_image LONGBLOB,
    PRIMARY KEY(id),
    
    -- Only update voyage_id on voyage updates (No deletion cascade)
    FOREIGN KEY (voyage_id) REFERENCES voyages(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Announcement (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	image BLOB NOT NULL,
	title VARCHAR(255) NOT NULL,
	description TEXT(65535) NOT NULL,
	details TEXT(65535) NOT NULL,
	PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Complaint (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	sender VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	subject TEXT(65535) NOT NULL,
	message TEXT(65535) NOT NULL,
	status ENUM('active', 'solved') DEFAULT 'active',
	PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prices (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	class VARCHAR(255) NOT NULL,
	value INTEGER NOT NULL,
	PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO station (city, title, personnel, phoneno, address)
VALUES
    ('İzmir', 'İzmir Marina', 'Ali Kaya', '+90 232 123 4567', 'Bahçelerarası, 35330 Balçova/İzmir, Turkey'),
    ('İstanbul', 'Yenikapı Terminal', 'Mehmet Yılmaz', '+90 212 987 6543', 'Katip Kasım, Kennedy Cad., 34131 Fatih/İstanbul, Turkey'),
    ('Bursa', 'Mudanya Hub', 'Zeynep Demir', '+90 224 321 7654', 'Güzelyalı Eğitim, 16940 Mudanya/Bursa, Turkey'),
    ('İzmir', 'Foça Station', 'Fatma Aydın', '+90 232 555 7890', 'Aşıklar Cd., 35680 Foça/İzmir, Turkey'),
    ('İstanbul', 'Kadıköy Station', 'Hasan Koç', '+90 212 888 1122', 'Caferağa, 34710 Kadıköy/İstanbul, Turkey');

SELECT * FROM station;