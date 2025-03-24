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

-- Voyage templates table for recurring schedules
CREATE TABLE voyage_templates (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    from_station INTEGER NOT NULL,
    to_station INTEGER NOT NULL,
    day_of_week TINYINT NOT NULL COMMENT '0=Sunday, 1=Monday, ..., 6=Saturday',
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    ship_type VARCHAR(255) NOT NULL,
    fuel_type BOOLEAN DEFAULT false,
    business_seats BIGINT UNSIGNED,
    promo_seats BIGINT UNSIGNED,
    economy_seats BIGINT UNSIGNED,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    
    -- References to stations
    FOREIGN KEY (from_station) REFERENCES station(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (to_station) REFERENCES station(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Voyages table (actual voyage instances)
CREATE TABLE voyages (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    template_id INTEGER NULL,
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
    is_modified BOOLEAN DEFAULT FALSE COMMENT 'Indicates if this voyage was modified from its template',
    PRIMARY KEY(id),
    
    -- Foreign keys
    FOREIGN KEY (template_id) REFERENCES voyage_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (from_station) REFERENCES station(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (to_station) REFERENCES station(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets table
CREATE TABLE tickets (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    TicketID VARCHAR(32) NOT NULL UNIQUE,
    voyage_id INTEGER,
    total_price INTEGER UNSIGNED NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    purchaser_name VARCHAR(255) NOT NULL,
    ticketData JSON NOT NULL,
    PRIMARY KEY(id),
    
    -- Only update voyage_id on voyage updates (No deletion cascade)
    FOREIGN KEY (voyage_id) REFERENCES voyages(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Announcement (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    image LONGBLOB NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    details TEXT NOT NULL,
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Complaint (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('active', 'solved') DEFAULT 'active',
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prices (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    class VARCHAR(255) NOT NULL,
    value INTEGER NOT NULL,
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_voyage_template_date ON voyages(template_id, departure_date);
CREATE INDEX idx_voyage_date ON voyages(departure_date);
CREATE INDEX idx_voyage_status ON voyages(status);

DELIMITER //

-- Procedure to generate voyages based on templates for a specific date range
CREATE PROCEDURE GenerateVoyages(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_template_id, v_from_station, v_to_station INT;
    DECLARE v_day_of_week TINYINT;
    DECLARE v_departure_time, v_arrival_time TIME;
    DECLARE v_ship_type VARCHAR(255);
    DECLARE v_fuel_type BOOLEAN;
    DECLARE v_business_seats, v_promo_seats, v_economy_seats BIGINT UNSIGNED;
    DECLARE curr_date DATE;
    DECLARE template_cursor CURSOR FOR 
        SELECT id, from_station, to_station, day_of_week, departure_time, arrival_time,
               ship_type, fuel_type, business_seats, promo_seats, economy_seats
        FROM voyage_templates
        WHERE is_active = TRUE;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Set the initial date to start_date
    SET curr_date = start_date;
    
    OPEN template_cursor;
    
    -- Loop through all templates
    template_loop: LOOP
        FETCH template_cursor INTO v_template_id, v_from_station, v_to_station, v_day_of_week, 
                                  v_departure_time, v_arrival_time, v_ship_type, v_fuel_type, 
                                  v_business_seats, v_promo_seats, v_economy_seats;
        IF done THEN
            LEAVE template_loop;
        END IF;
        
        -- Reset to start date for each template
        SET curr_date = start_date;
        
        -- Find the first occurrence of the day of week on or after start_date
        WHILE DAYOFWEEK(curr_date) != v_day_of_week + 1 DO
            SET curr_date = DATE_ADD(curr_date, INTERVAL 1 DAY);
        END WHILE;
        
        -- Generate all weekly occurrences until end_date
        WHILE curr_date <= end_date DO
            -- Check if a voyage already exists for this template and date
            IF NOT EXISTS (
                SELECT 1 FROM voyages 
                WHERE template_id = v_template_id 
                AND departure_date = curr_date
                AND departure_time = v_departure_time
            ) THEN
                -- Insert the new voyage
                INSERT INTO voyages (
                    template_id, from_station, to_station, 
                    departure_date, departure_time, arrival_time,
                    ship_type, fuel_type, business_seats, promo_seats, economy_seats
                ) VALUES (
                    v_template_id, v_from_station, v_to_station,
                    curr_date, v_departure_time, v_arrival_time,
                    v_ship_type, v_fuel_type, v_business_seats, v_promo_seats, v_economy_seats
                );
            END IF;
            
            -- Move to next week
            SET curr_date = DATE_ADD(curr_date, INTERVAL 7 DAY);
        END WHILE;
    END LOOP;
    
    CLOSE template_cursor;
END //

-- Update future voyages from a template
CREATE PROCEDURE UpdateFutureVoyagesFromTemplate(
    IN p_template_id INT,
    IN start_date DATE
)
BEGIN
    -- Update all future non-modified voyages from this template
    UPDATE voyages
    SET 
        from_station = (SELECT from_station FROM voyage_templates WHERE id = p_template_id),
        to_station = (SELECT to_station FROM voyage_templates WHERE id = p_template_id),
        departure_time = (SELECT departure_time FROM voyage_templates WHERE id = p_template_id),
        arrival_time = (SELECT arrival_time FROM voyage_templates WHERE id = p_template_id),
        ship_type = (SELECT ship_type FROM voyage_templates WHERE id = p_template_id),
        fuel_type = (SELECT fuel_type FROM voyage_templates WHERE id = p_template_id),
        business_seats = (SELECT business_seats FROM voyage_templates WHERE id = p_template_id),
        promo_seats = (SELECT promo_seats FROM voyage_templates WHERE id = p_template_id),
        economy_seats = (SELECT economy_seats FROM voyage_templates WHERE id = p_template_id)
    WHERE
        template_id = p_template_id
        AND departure_date >= start_date
        AND is_modified = FALSE;
END //

-- Cancel a specific voyage
CREATE PROCEDURE CancelVoyage(
    IN voyage_id INT
)
BEGIN
    UPDATE voyages
    SET status = 'cancel', is_modified = TRUE
    WHERE id = voyage_id;
END //

-- Cancel a series of voyages from a template
CREATE PROCEDURE CancelVoyageSeriesFromDate(
    IN p_template_id INT,
    IN from_date DATE
)
BEGIN
    UPDATE voyages
    SET status = 'cancel', is_modified = TRUE
    WHERE template_id = p_template_id
    AND departure_date >= from_date;
END //

-- Delete all future unmodified voyages from a specific template
-- Useful when completely changing a template
CREATE PROCEDURE RemoveUnmodifiedVoyages(
    IN p_template_id INT,
    IN from_date DATE
)
BEGIN
    DELETE FROM voyages
    WHERE template_id = p_template_id
    AND departure_date >= from_date
    AND is_modified = FALSE;
END //

-- Create a voyage outside of the template system (one-off voyage)
CREATE PROCEDURE CreateOneOffVoyage(
    IN p_from_station INTEGER,
    IN p_to_station INTEGER,
    IN p_departure_date DATE,
    IN p_departure_time TIME,
    IN p_arrival_time TIME,
    IN p_ship_type VARCHAR(255),
    IN p_fuel_type BOOLEAN,
    IN p_business_seats BIGINT UNSIGNED,
    IN p_promo_seats BIGINT UNSIGNED,
    IN p_economy_seats BIGINT UNSIGNED
)
BEGIN
    INSERT INTO voyages (
        template_id, from_station, to_station, 
        departure_date, departure_time, arrival_time,
        ship_type, fuel_type, business_seats, promo_seats, economy_seats,
        is_modified
    ) VALUES (
        NULL, p_from_station, p_to_station,
        p_departure_date, p_departure_time, p_arrival_time,
        p_ship_type, p_fuel_type, p_business_seats, p_promo_seats, p_economy_seats,
        TRUE
    );
END //

-- Generate multiple voyages from a simple date range (useful for bulk operations)
CREATE PROCEDURE GenerateVoyagesForTemplate(
    IN p_template_id INT,
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    DECLARE v_from_station, v_to_station INT;
    DECLARE v_day_of_week TINYINT;
    DECLARE v_departure_time, v_arrival_time TIME;
    DECLARE v_ship_type VARCHAR(255);
    DECLARE v_fuel_type BOOLEAN;
    DECLARE v_business_seats, v_promo_seats, v_economy_seats BIGINT UNSIGNED;
    DECLARE curr_date DATE;
    
    -- Get template data
    SELECT from_station, to_station, day_of_week, departure_time, arrival_time,
           ship_type, fuel_type, business_seats, promo_seats, economy_seats
    INTO v_from_station, v_to_station, v_day_of_week, v_departure_time, v_arrival_time,
         v_ship_type, v_fuel_type, v_business_seats, v_promo_seats, v_economy_seats
    FROM voyage_templates
    WHERE id = p_template_id AND is_active = TRUE;
    
    -- Set the initial date to start_date
    SET curr_date = start_date;
    
    -- Find the first occurrence of the day of week on or after start_date
    WHILE DAYOFWEEK(curr_date) != v_day_of_week + 1 DO
        SET curr_date = DATE_ADD(curr_date, INTERVAL 1 DAY);
    END WHILE;
    
    -- Generate all weekly occurrences until end_date
    WHILE curr_date <= end_date DO
        -- Check if a voyage already exists for this template and date
        IF NOT EXISTS (
            SELECT 1 FROM voyages 
            WHERE template_id = p_template_id 
            AND departure_date = curr_date
            AND departure_time = v_departure_time
        ) THEN
            -- Insert the new voyage
            INSERT INTO voyages (
                template_id, from_station, to_station, 
                departure_date, departure_time, arrival_time,
                ship_type, fuel_type, business_seats, promo_seats, economy_seats
            ) VALUES (
                p_template_id, v_from_station, v_to_station,
                curr_date, v_departure_time, v_arrival_time,
                v_ship_type, v_fuel_type, v_business_seats, v_promo_seats, v_economy_seats
            );
        END IF;
        
        -- Move to next week
        SET curr_date = DATE_ADD(curr_date, INTERVAL 7 DAY);
    END WHILE;
END //

DELIMITER ;

-- Insert station data
INSERT INTO station (city, title, personnel, phoneno, address)
VALUES
    ('İzmir', 'İzmir Marina', 'Ali Kaya', '+90 232 123 4567', 'Bahçelerarası, 35330 Balçova/İzmir, Turkey'),
    ('İstanbul', 'Yenikapı Terminal', 'Mehmet Yılmaz', '+90 212 987 6543', 'Katip Kasım, Kennedy Cad., 34131 Fatih/İstanbul, Turkey'),
    ('Bursa', 'Mudanya Hub', 'Zeynep Demir', '+90 224 321 7654', 'Güzelyalı Eğitim, 16940 Mudanya/Bursa, Turkey'),
    ('İzmir', 'Foça Station', 'Fatma Aydın', '+90 232 555 7890', 'Aşıklar Cd., 35680 Foça/İzmir, Turkey'),
    ('İstanbul', 'Kadıköy Station', 'Hasan Koç', '+90 212 888 1122', 'Caferağa, 34710 Kadıköy/İstanbul, Turkey');

-- Insert voyage templates
INSERT INTO voyage_templates 
(from_station, to_station, day_of_week, departure_time, arrival_time, ship_type, fuel_type, business_seats, promo_seats, economy_seats) 
VALUES
-- İzmir to İstanbul - Monday, Wednesday, Friday
(1, 2, 1, '08:00:00', '12:30:00', 'Large Ferry', false, 50, 20, 200),
(1, 2, 3, '08:30:00', '13:00:00', 'Large Ferry', false, 50, 20, 200),
(1, 2, 5, '09:00:00', '13:30:00', 'Fast Ferry', true, 30, 10, 100),

-- İstanbul to İzmir - Tuesday, Thursday, Sunday
(2, 1, 2, '09:00:00', '13:30:00', 'Large Ferry', false, 50, 20, 200),
(2, 1, 4, '10:00:00', '14:30:00', 'Fast Ferry', true, 30, 10, 100),
(2, 1, 0, '15:00:00', '19:30:00', 'Large Ferry', false, 50, 20, 200),

-- İzmir to Bursa - Tuesday, Saturday
(1, 3, 2, '07:00:00', '10:30:00', 'Fast Ferry', true, 30, 10, 100),
(1, 3, 6, '06:30:00', '10:00:00', 'Large Ferry', false, 50, 20, 200),

-- Bursa to İzmir - Wednesday, Sunday
(3, 1, 3, '16:00:00', '19:30:00', 'Fast Ferry', true, 30, 10, 100),
(3, 1, 0, '15:00:00', '18:30:00', 'Large Ferry', false, 50, 20, 200),

-- İstanbul to İzmir (Foça) - Monday, Friday
(2, 4, 1, '07:30:00', '13:00:00', 'Fast Ferry', true, 30, 10, 100),
(2, 4, 5, '08:30:00', '14:00:00', 'Large Ferry', false, 50, 20, 200),

-- İzmir (Foça) to İstanbul - Tuesday, Saturday
(4, 2, 2, '14:00:00', '19:30:00', 'Fast Ferry', true, 30, 10, 100),
(4, 2, 6, '15:00:00', '20:30:00', 'Large Ferry', false, 50, 20, 200);

-- Generate voyages for the next 3 months
CALL GenerateVoyages(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH));

-- Modify some specific voyages to show independent modification
UPDATE voyages 
SET departure_time = '09:30:00', arrival_time = '14:00:00', is_modified = TRUE
WHERE id = 1;

UPDATE voyages 
SET status = 'cancel', is_modified = TRUE
WHERE id = 5;

-- Adjust seat numbers for a specific voyage
UPDATE voyages 
SET business_seats = 40, promo_seats = 15, economy_seats = 180, is_modified = TRUE
WHERE id = 10;

-- Create a one-off special voyage (no template)
CALL CreateOneOffVoyage(
    2, 3, -- From İstanbul to Bursa
    DATE_ADD(CURDATE(), INTERVAL 15 DAY), -- 15 days from now
    '10:00:00', '12:30:00', -- Times
    'Luxury Cruise Ferry', true, 100, 50, 300 -- Boat type and seats
);

-- Insert prices
INSERT INTO prices (class, value) VALUES
('economy', 200),
('promo', 350),
('business', 600);

-- Insert some tickets
-- We need to get actual voyage IDs first
SET @voyage_id1 = (SELECT id FROM voyages LIMIT 1);
SET @voyage_id2 = (SELECT id FROM voyages WHERE id > @voyage_id1 LIMIT 1);
SET @voyage_id3 = (SELECT id FROM voyages WHERE id > @voyage_id2 LIMIT 1);

INSERT INTO tickets (TicketID, voyage_id, total_price, user_id, purchaser_name, ticketData) VALUES
('TKT12345678', @voyage_id1, 600, 'user123', 'Ali Yilmaz', '{"seats": ["B12"], "class": "business", "passengers": [{"name": "Ali Yilmaz", "id": "12345678901"}]}'),
('TKT23456789', @voyage_id1, 200, 'user456', 'Fatma Demir', '{"seats": ["E45"], "class": "economy", "passengers": [{"name": "Fatma Demir", "id": "23456789012"}]}'),
('TKT34567890', @voyage_id2, 350, 'user789', 'Mustafa Kaya', '{"seats": ["P07"], "class": "promo", "passengers": [{"name": "Mustafa Kaya", "id": "34567890123"}]}'),
('TKT45678901', @voyage_id2, 600, 'user123', 'Ali Yilmaz', '{"seats": ["B08"], "class": "business", "passengers": [{"name": "Ali Yilmaz", "id": "12345678901"}]}'),
('TKT56789012', @voyage_id3, 400, 'user234', 'Ayse Yildiz', '{"seats": ["E22", "E23"], "class": "economy", "passengers": [{"name": "Ayse Yildiz", "id": "45678901234"}, {"name": "Mehmet Yildiz", "id": "56789012345"}]}');

-- Insert some complaints
INSERT INTO Complaint (user_id, sender, email, subject, message)
VALUES
    ('user123', 'Ali Yilmaz', 'ali.yilmaz@example.com', 'Delay on Monday Ferry', 'The ferry on Monday was delayed by 30 minutes without any announcement. I almost missed my connection.'),
    ('user456', 'Fatma Demir', 'fatma.demir@example.com', 'Cleanliness Issue', 'The restrooms on the ferry were not in good condition during my journey on Tuesday.');

-- Show some verification data
SELECT 'Stations' AS TableName, COUNT(*) AS RecordCount FROM station
UNION ALL
SELECT 'Voyage Templates', COUNT(*) FROM voyage_templates
UNION ALL
SELECT 'Voyages', COUNT(*) FROM voyages
UNION ALL
SELECT 'Tickets', COUNT(*) FROM tickets
UNION ALL
SELECT 'Announcements', COUNT(*) FROM Announcement
UNION ALL
SELECT 'Complaints', COUNT(*) FROM Complaint;

-- Display all stations
SELECT * FROM station;

-- Display voyage templates with station names
SELECT 
    vt.id, 
    s1.city AS from_city,
    s1.title AS from_title,
    s2.city AS to_city,
    s2.title AS to_title,
    vt.day_of_week,
    vt.departure_time,
    vt.arrival_time,
    vt.ship_type,
    vt.fuel_type,
    vt.business_seats,
    vt.promo_seats,
    vt.economy_seats
FROM voyage_templates vt
JOIN station s1 ON vt.from_station = s1.id
JOIN station s2 ON vt.to_station = s2.id
ORDER BY vt.id;