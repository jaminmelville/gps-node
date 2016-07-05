DROP USER 'gps'@'localhost';
DROP DATABASE IF EXISTS gps;

CREATE DATABASE gps
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE USER 'gps'@'localhost' IDENTIFIED BY 'ninjafrog';
GRANT ALL PRIVILEGES ON gps.* TO 'gps'@'localhost';

USE gps;

CREATE TABLE Activity
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(25) UNIQUE,
  start_time BIGINT,
  elapsed_time INT,
  distance FLOAT,
  deleted BOOL DEFAULT false,
  note TEXT
);

CREATE TABLE Tag
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE ActivityTag
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  tag_id INT NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activity(id),
  FOREIGN KEY (tag_id) REFERENCES Tag(id),
  CONSTRAINT uc_ActivityTag UNIQUE (activity_id, tag_id)
);

CREATE TABLE Record
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  latitude DECIMAL(16,14) NOT NULL,
  longitude DECIMAL(17,14) NOT NULL,
  time BIGINT NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activity(id)
);
