USE sitebuilder;

-- Add demo user
INSERT INTO users (name, email, password)
VALUES ('Test User', 'test@example.com', '$2a$10$fakehashedpassword123456');

-- Add a sample site
INSERT INTO sites (user_id, slug, business_name, tagline)
VALUES (1, 'demo-site', 'Demo Business', 'We build demos.');

-- Add a blog
INSERT INTO blogs (user_id, slug, title, content)
VALUES (1, 'hello-world', 'Hello World', 'This is a sample blog.');

-- Add dummy GMB token (not real)
INSERT INTO gmb_tokens (user_id, access_token, refresh_token, expires_at, gmb_email)
VALUES (1, 'dummy_access', 'dummy_refresh', NOW(), 'demo@gmail.com');
