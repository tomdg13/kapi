-- ========================================================
-- Seed script: car_brand + car_model
-- Includes: cars, motorcycles (ລົດຈັກ), and EVs (ລົດໄຟຟ້າ)
-- Safe to re-run: uses INSERT IGNORE on unique brand_name
-- ========================================================

-- 1) Make sure brand_name is unique so INSERT IGNORE works cleanly
ALTER TABLE car_brand ADD UNIQUE KEY uq_brand_name (brand_name);

-- ========================================================
-- BRANDS
-- ========================================================
INSERT IGNORE INTO car_brand (brand_name, is_active) VALUES
-- Mainstream car brands (common in Laos)
('Toyota', 1), ('Honda', 1), ('Nissan', 1), ('Mazda', 1), ('Mitsubishi', 1),
('Isuzu', 1), ('Suzuki', 1), ('Ford', 1), ('Chevrolet', 1), ('Hyundai', 1),
('Kia', 1), ('Volkswagen', 1), ('BMW', 1), ('Mercedes-Benz', 1), ('Audi', 1),
('Lexus', 1), ('Subaru', 1), ('MG', 1), ('Chery', 1), ('Great Wall Motors', 1),
('Haval', 1), ('Volvo', 1), ('Peugeot', 1), ('Mini', 1),

-- Motorcycle brands (ລົດຈັກ)
('Honda Motorcycle', 1), ('Yamaha', 1), ('Suzuki Motorcycle', 1),
('Kawasaki', 1), ('KTM', 1), ('Vespa', 1), ('Piaggio', 1), ('Kymco', 1),
('SYM', 1), ('Benelli', 1), ('Ducati', 1), ('Royal Enfield', 1),
('Zongshen', 1), ('Loncin', 1), ('Haojue', 1),

-- EV brands (ລົດໄຟຟ້າ)
('Tesla', 1), ('BYD', 1), ('ORA (Great Wall)', 1), ('NETA', 1),
('MG EV', 1), ('Wuling', 1), ('GAC Aion', 1), ('XPeng', 1),
('NIO', 1), ('Deepal', 1), ('Zeekr', 1), ('VinFast', 1),
('Yadea (E-Motorcycle)', 1), ('NIU (E-Motorcycle)', 1);

-- ========================================================
-- MODELS — Toyota
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Toyota' brand_name, 'Vios' model_name UNION ALL
  SELECT 'Toyota','Camry' UNION ALL
  SELECT 'Toyota','Corolla Altis' UNION ALL
  SELECT 'Toyota','Yaris' UNION ALL
  SELECT 'Toyota','Hilux Revo' UNION ALL
  SELECT 'Toyota','Fortuner' UNION ALL
  SELECT 'Toyota','Innova' UNION ALL
  SELECT 'Toyota','Avanza' UNION ALL
  SELECT 'Toyota','Land Cruiser' UNION ALL
  SELECT 'Toyota','Prado' UNION ALL
  SELECT 'Toyota','RAV4' UNION ALL
  SELECT 'Toyota','C-HR'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — Honda (car)
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Honda' brand_name, 'City' model_name UNION ALL
  SELECT 'Honda','Civic' UNION ALL
  SELECT 'Honda','Accord' UNION ALL
  SELECT 'Honda','Jazz' UNION ALL
  SELECT 'Honda','HR-V' UNION ALL
  SELECT 'Honda','CR-V' UNION ALL
  SELECT 'Honda','BR-V'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — Isuzu
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Isuzu' brand_name, 'D-Max' model_name UNION ALL
  SELECT 'Isuzu','MU-X'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — Mitsubishi
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Mitsubishi' brand_name, 'Mirage' model_name UNION ALL
  SELECT 'Mitsubishi','Attrage' UNION ALL
  SELECT 'Mitsubishi','Xpander' UNION ALL
  SELECT 'Mitsubishi','Triton' UNION ALL
  SELECT 'Mitsubishi','Pajero Sport' UNION ALL
  SELECT 'Mitsubishi','Outlander'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — Ford
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Ford' brand_name, 'Ranger' model_name UNION ALL
  SELECT 'Ford','Everest' UNION ALL
  SELECT 'Ford','Focus' UNION ALL
  SELECT 'Ford','Fiesta'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — Nissan / Mazda / Suzuki / Hyundai / Kia
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Nissan' brand_name, 'Almera' model_name UNION ALL
  SELECT 'Nissan','Navara' UNION ALL
  SELECT 'Nissan','Terra' UNION ALL
  SELECT 'Nissan','X-Trail' UNION ALL
  SELECT 'Mazda','Mazda2' UNION ALL
  SELECT 'Mazda','Mazda3' UNION ALL
  SELECT 'Mazda','CX-5' UNION ALL
  SELECT 'Mazda','BT-50' UNION ALL
  SELECT 'Suzuki','Swift' UNION ALL
  SELECT 'Suzuki','Ertiga' UNION ALL
  SELECT 'Suzuki','Celerio' UNION ALL
  SELECT 'Suzuki','XL7' UNION ALL
  SELECT 'Hyundai','Accent' UNION ALL
  SELECT 'Hyundai','Elantra' UNION ALL
  SELECT 'Hyundai','Tucson' UNION ALL
  SELECT 'Hyundai','Santa Fe' UNION ALL
  SELECT 'Kia','Rio' UNION ALL
  SELECT 'Kia','Seltos' UNION ALL
  SELECT 'Kia','Sportage' UNION ALL
  SELECT 'Kia','Carnival'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — Motorcycles (Honda Motorcycle / Yamaha / Suzuki / Kawasaki)
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Honda Motorcycle' brand_name, 'Wave 110i' model_name UNION ALL
  SELECT 'Honda Motorcycle','Click 125i' UNION ALL
  SELECT 'Honda Motorcycle','PCX 160' UNION ALL
  SELECT 'Honda Motorcycle','ADV 160' UNION ALL
  SELECT 'Honda Motorcycle','CB150R' UNION ALL
  SELECT 'Honda Motorcycle','CBR150R' UNION ALL
  SELECT 'Honda Motorcycle','Rebel 300' UNION ALL
  SELECT 'Yamaha','Exciter 155' UNION ALL
  SELECT 'Yamaha','NMAX' UNION ALL
  SELECT 'Yamaha','Aerox 155' UNION ALL
  SELECT 'Yamaha','Fino' UNION ALL
  SELECT 'Yamaha','MT-15' UNION ALL
  SELECT 'Yamaha','YZF-R15' UNION ALL
  SELECT 'Suzuki Motorcycle','Raider R150' UNION ALL
  SELECT 'Suzuki Motorcycle','GSX-R150' UNION ALL
  SELECT 'Suzuki Motorcycle','Address 110' UNION ALL
  SELECT 'Kawasaki','Ninja 250' UNION ALL
  SELECT 'Kawasaki','Ninja 400' UNION ALL
  SELECT 'Kawasaki','KLX 150' UNION ALL
  SELECT 'Vespa','Primavera' UNION ALL
  SELECT 'Vespa','Sprint' UNION ALL
  SELECT 'Royal Enfield','Classic 350' UNION ALL
  SELECT 'Royal Enfield','Meteor 350'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — EVs (cars)
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Tesla' brand_name, 'Model 3' model_name UNION ALL
  SELECT 'Tesla','Model Y' UNION ALL
  SELECT 'BYD','Atto 3' UNION ALL
  SELECT 'BYD','Dolphin' UNION ALL
  SELECT 'BYD','Seal' UNION ALL
  SELECT 'BYD','Han' UNION ALL
  SELECT 'ORA (Great Wall)','Good Cat' UNION ALL
  SELECT 'NETA','V' UNION ALL
  SELECT 'NETA','X' UNION ALL
  SELECT 'MG EV','MG4 Electric' UNION ALL
  SELECT 'MG EV','MG ZS EV' UNION ALL
  SELECT 'Wuling','Air EV' UNION ALL
  SELECT 'GAC Aion','Y Plus' UNION ALL
  SELECT 'VinFast','VF e34' UNION ALL
  SELECT 'VinFast','VF 8'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- MODELS — E-Motorcycles (ລົດຈັກໄຟຟ້າ)
-- ========================================================
INSERT INTO car_model (brand_id, model_name, is_active)
SELECT b.brand_id, m.model_name, 1
FROM car_brand b
JOIN (
  SELECT 'Yadea (E-Motorcycle)' brand_name, 'G5' model_name UNION ALL
  SELECT 'Yadea (E-Motorcycle)','T9' UNION ALL
  SELECT 'NIU (E-Motorcycle)','NQi' UNION ALL
  SELECT 'NIU (E-Motorcycle)','MQi'
) m ON m.brand_name = b.brand_name
LEFT JOIN car_model cm ON cm.brand_id = b.brand_id AND cm.model_name = m.model_name
WHERE cm.model_id IS NULL;

-- ========================================================
-- Sanity check counts
-- ========================================================
SELECT COUNT(*) AS total_brands FROM car_brand;
SELECT COUNT(*) AS total_models FROM car_model;
