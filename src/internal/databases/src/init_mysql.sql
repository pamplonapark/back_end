CREATE DATABASE IF NOT EXISTS pamplonapark;
USE pamplonapark;

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

CREATE TABLE IF NOT EXISTS Favorites(
	id BIGINT PRIMARY KEY,
	uuid CHAR(36) DEFAULT (UUID()) UNIQUE
);

CREATE TABLE IF NOT EXISTS User_Favorite(
	id_user BIGINT,
    id_favorite BIGINT,
	uuid CHAR(36) DEFAULT (UUID()) UNIQUE,
    
    PRIMARY KEY(id_user, id_favorite)
);

ALTER TABLE User_Favorite ADD CONSTRAINT id_user FOREIGN KEY(id_user) REFERENCES Users_(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE User_Favorite ADD CONSTRAINT id_favorite FOREIGN KEY(id_favorite) REFERENCES Favorites(id) ON UPDATE CASCADE ON DELETE CASCADE;

DROP TRIGGER IF EXISTS add_creation_date;
DROP TRIGGER IF EXISTS add_modification_date;
DROP TRIGGER IF EXISTS log_update_user_favorite;
DROP TRIGGER IF EXISTS log_delete_user_favorite;

/* Trigger to create log when user inserted */
DELIMITER %%
CREATE TRIGGER add_insert_log BEFORE INSERT ON Users_ FOR EACH ROW
BEGIN
	INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Users_", "INSERT", NEW.uuid, "Inserted new user");
END %%
DELIMITER ;

/* USER_ TABLE MODIFICATION */
/* Trigger to add modification date to user */
DELIMITER %%
CREATE TRIGGER add_modification_date BEFORE UPDATE ON Users_ FOR EACH ROW
BEGIN
		SET NEW.last_modification_date = CURRENT_TIMESTAMP;
		INSERT INTO Logs_(table_affected, action_performed, user_affected, explanation) VALUES("Users_", "UPDATE", NEW.uuid, "Updated user");
END %%
DELIMITER ;

/* Trigger to log update of FK to in User_Favorite */
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