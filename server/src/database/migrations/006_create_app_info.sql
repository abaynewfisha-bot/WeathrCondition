
CREATE TABLE IF NOT EXISTS app_info (
    id SERIAL PRIMARY KEY,

    app_name VARCHAR(100) NOT NULL DEFAULT 'WeatherWorld',

    version VARCHAR(20) NOT NULL DEFAULT '1.0.0',

    description TEXT,

    developer_name VARCHAR(150),

    contact_email VARCHAR(150),

    website_url TEXT,

    github_url TEXT,

    privacy_policy_url TEXT,

    terms_url TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_info (
    app_name,
    version,
    description,
    developer_name
)
VALUES (
    'WeatherWorld',
    '1.0.0',
    'Know the Weather, Plan Your Day.',
    'WeatherWorld Development Team'
)
ON CONFLICT DO NOTHING;
