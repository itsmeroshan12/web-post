CREATE TABLE IF NOT EXISTS gmb_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at DATETIME,
  gmb_email VARCHAR(150),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
