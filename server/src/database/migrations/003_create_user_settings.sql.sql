

CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(id) ON DELETE CASCADE,

    temperature_unit VARCHAR(20) NOT NULL DEFAULT 'celsius'
        CHECK (temperature_unit IN ('celsius', 'fahrenheit')),

    theme VARCHAR(20) NOT NULL DEFAULT 'system'
        CHECK (theme IN ('light', 'dark', 'system')),

    language VARCHAR(10) NOT NULL DEFAULT 'en',

    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    weather_alerts BOOLEAN NOT NULL DEFAULT TRUE,

    email_notifications BOOLEAN NOT NULL DEFAULT FALSE,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
