CREATE DATABASE IF NOT EXISTS pamplonapark;
USE pamplonapark;

/* TABLE CREATION */
/* Log table */
CREATE TABLE IF NOT EXISTS Logs_ (
	log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	uuid CHAR(36) DEFAULT (UUID()) UNIQUE,
	table_affected VARCHAR(255) NOT NULL,
	action_performed VARCHAR(255) NOT NULL,
	user_affected VARCHAR(255) NOT NULL,
	explanation VARCHAR(255) NOT NULL,
	timestamp_execution TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users_(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	uuid CHAR(36) DEFAULT (UUID()) UNIQUE,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_ VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modification_date TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS User_Favorite(
	id_user BIGINT,
    id_favorite BIGINT,
	uuid CHAR(36) DEFAULT (UUID()) UNIQUE,
    
    PRIMARY KEY(id_user, id_favorite)
);

CREATE TABLE IF NOT EXISTS Parkings(
	id BIGINT PRIMARY KEY,
	uuid CHAR(36) DEFAULT (UUID()) UNIQUE,
	name VARCHAR(255),
	address VARCHAR(255),
	hours_active VARCHAR(255),
	available_spots VARCHAR(255),
	latitude VARCHAR(255),
	spots VARCHAR(255),
	telephone VARCHAR(255),
	longitude VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Parkings_Prices(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	id_parking BIGINT NOT NULL,
	code BIGINT NOT NULL,
	description VARCHAR(255) NOT NULL,
	amount DECIMAL(65, 30) NOT NULL,

	UNIQUE(id_parking, code)
);

/* CONSTRAINTS */
ALTER TABLE User_Favorite ADD CONSTRAINT id_user FOREIGN KEY(id_user) REFERENCES Users_(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE User_Favorite ADD CONSTRAINT id_favorite FOREIGN KEY(id_favorite) REFERENCES Parkings(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE Parkings_Prices ADD CONSTRAINT id_parking FOREIGN KEY(id) REFERENCES Parkings(id) ON UPDATE CASCADE ON DELETE CASCADE;

DROP TRIGGER IF EXISTS add_creation_date;
DROP TRIGGER IF EXISTS add_modification_date;
DROP TRIGGER IF EXISTS log_update_user_favorite;
DROP TRIGGER IF EXISTS log_delete_user_favorite;
DROP TRIGGER IF EXISTS log_insert_parkings;
DROP TRIGGER IF EXISTS log_update_parking;
DROP TRIGGER IF EXISTS log_delete_parking;
DROP TRIGGER IF EXISTS log_insert_parking_price;
DROP TRIGGER IF EXISTS log_update_parking_price;
DROP TRIGGER IF EXISTS log_delete_parking_price;

/* USER_ TABLE MODIFICATION */
/* Trigger to create log when user inserted */
DELIMITER %%
CREATE TRIGGER add_insert_log BEFORE INSERT ON Users_ FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Users_", "INSERT", NEW.uuid, "Inserted new user");
END %%
DELIMITER ;

/* Trigger to add modification date to user */
DELIMITER %%
CREATE TRIGGER add_modification_date BEFORE UPDATE ON Users_ FOR EACH ROW
BEGIN
		SET NEW.last_modification_date = CURRENT_TIMESTAMP;
		INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Users_", "UPDATE", NEW.uuid, "Updated user");
END %%
DELIMITER ;

/* Trigger to create log when user deleted */
DELIMITER %%
CREATE TRIGGER log_delete_user BEFORE DELETE ON Users_ FOR EACH ROW
BEGIN
		INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Users_", "DELETE", OLD.uuid, "Removed user");
END %%
DELIMITER ;

/* USER_FAVORITE TABLE MODIFICATION */
/* Trigger to log insert User_Favorite */
DELIMITER %%
CREATE TRIGGER log_insert_user_favorite BEFORE INSERT ON User_Favorite FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("User_Favorite", "INSERT", NEW.uuid, CONCAT("Inserted new user-favorite relation:\nUser: ", NEW.id_user, "\nFavorite: ", NEW.id_favorite));
END %%
DELIMITER ;

/* Trigger to log update of FK to in User_Favorite */
DELIMITER %%
CREATE TRIGGER log_update_user_favorite BEFORE UPDATE ON User_Favorite FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("User_Favorite", "UPDATE", NEW.uuid, CONCAT("Updated user-favorite relation:\nNew User: ", NEW.id_user, "\nOld User:", OLD.id_user, "\nNew Favorite: ", NEW.id_favorite, "\nOld Favorite: ", OLD.id_favorite));
END %%
DELIMITER ;

/* Trigger to log delete of FK to in User_Favorite */
DELIMITER %%
CREATE TRIGGER log_delete_user_favorite BEFORE DELETE ON User_Favorite FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("User_Favorite", "DELETE", OLD.uuid, CONCAT("Removed user-favorite relation:\nUser: ", OLD.id_user, "\nFavorite: ", OLD.id_favorite));
END %%
DELIMITER ;

/* PARKINGS TABLE MODIFICATION */
/* Trigger to log insert parking */
DELIMITER %%
CREATE TRIGGER log_insert_parkings BEFORE INSERT ON Parkings FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Parkings", "INSERT", NEW.uuid, "Inserted new parking");
END %%
DELIMITER ;

/* Trigger to add updated parking to logs */
DELIMITER %%
CREATE TRIGGER log_update_parking BEFORE UPDATE ON Parkings FOR EACH ROW
BEGIN
		INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Parkings", "UPDATE", NEW.uuid, "Updated parking");
END %%
DELIMITER ;

/*  Trigger to add deleted parking to logs  */
DELIMITER %%
CREATE TRIGGER log_delete_parking BEFORE DELETE ON Parkings FOR EACH ROW
BEGIN
		INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Parkings", "DELETE", OLD.uuid, "Removed parking");
END %%
DELIMITER ;

/* PARKINGS_PRICES TABLE MODIFICATION */
/* Trigger to log insert new price */
DELIMITER %%
CREATE TRIGGER log_insert_parking_price BEFORE INSERT ON Parkings_Prices FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Parkings_Price", "INSERT", NEW.id, CONCAT("Inserted new parking-price relation:\nParking: ", NEW.id_parking, "\nPrice: ", NEW.id));
END %%
DELIMITER ;

/*  Trigger to add updated parking price to logs */
DELIMITER %%
CREATE TRIGGER log_update_parking_price BEFORE UPDATE ON Parkings_Prices FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Parkings_Price", "UPDATE", NEW.id, CONCAT("Updated parking-price relation:\nNew Parking: ", NEW.id_parking, "\nOld Parking:", OLD.id_parking, "\nNew Price: ", NEW.id, "\nOld Price: ", OLD.id));
END %%
DELIMITER ;

/*  Trigger to add deleted parking price to logs */
DELIMITER %%
CREATE TRIGGER log_delete_parking_price BEFORE DELETE ON Parkings_Prices FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Parkings_Price", "DELETE", OLD.id, CONCAT("Removed user-favorite relation:\nParking: ", OLD.id_parking, "\nPrice: ", OLD.id));
END %%
DELIMITER ;