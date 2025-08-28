CREATE TABLE IF NOT EXISTS sites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  business_name VARCHAR(255),
  tagline TEXT,
  logo_url TEXT,
  about TEXT,
  contact_info JSON,
  services JSON,
  gallery JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
