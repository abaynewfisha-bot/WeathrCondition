INSERT INTO cities
    (name, country, latitude, longitude, timezone)
VALUES
    ('Nairobi', 'Kenya', -1.286389, 36.817223, 'Africa/Nairobi'),
    ('Tokyo', 'Japan', 35.6762, 139.6503, 'Asia/Tokyo'),
    ('London', 'United Kingdom', 51.5072, -0.1276, 'Europe/London'),
    ('New York', 'United States', 40.7128, -74.0060, 'America/New_York'),
    ('Paris', 'France', 48.8566, 2.3522, 'Europe/Paris'),
    ('Dubai', 'United Arab Emirates', 25.2048, 55.2708, 'Asia/Dubai'),
    ('Riyadh', 'Saudi Arabia', 24.7136, 46.6753, 'Asia/Riyadh'),
    ('Oslo', 'Norway', 59.9139, 10.7522, 'Europe/Oslo'),
    ('Addis Ababa', 'Ethiopia', 9.03, 38.74, 'Africa/Addis_Ababa')
ON CONFLICT (name, country) DO NOTHING;
