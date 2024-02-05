USE pamplonapark;

INSERT IGNORE INTO Logs_ (table_affected, action_performed, user_affected, explanation) 
VALUES ('Users_', 'INSERT', 'admin', 'Inserted new user record'),
       ('Users_', 'UPDATE', 'user123', 'Updated user information'),
       ('Users_', 'DELETE', 'user456', 'Deleted user account'),
       ('Favorites', 'INSERT', 'admin', 'Inserted new favorite record'),
       ('Favorites', 'UPDATE', 'user789', 'Updated favorite information'),
       ('Favorites', 'DELETE', 'user123', 'Deleted favorite'),
       ('User_Favorite', 'INSERT', 'user789', 'Added favorite to user'),
       ('User_Favorite', 'DELETE', 'user456', 'Removed favorite from user'),
       ('User_Favorite', 'UPDATE', 'user123', 'Updated user favorite'),
       ('User_Favorite', 'INSERT', 'user456', 'Added new user favorite');

INSERT IGNORE INTO Users_ (id, username, email, password_) 
VALUES ('1', 'admin', 'admin@example.com', 'admin123'),
       ('2', 'user123', 'user123@example.com', 'user123pass'),
       ('3', 'user456', 'user456@example.com', 'user456pass'),
       ('4', 'user789', 'user789@example.com', 'user789pass'),
       ('5', 'john_doe', 'john_doe@example.com', 'john_doe_pass'),
       ('6', 'jane_doe', 'jane_doe@example.com', 'jane_doe_pass'),
       ('7', 'test_user', 'test_user@example.com', 'test_user_pass'),
       ('8', 'demo_user', 'demo_user@example.com', 'demo_user_pass'),
       ('9', 'new_user', 'new_user@example.com', 'new_user_pass'),
       ('10', 'sample_user', 'sample_user@example.com', 'sample_user_pass');

INSERT IGNORE INTO Favorites (id) 
VALUES ('1'),
       ('2'),
       ('3'),
       ('4'),
       ('5'),
       ('6'),
       ('7'),
       ('8'),
       ('9'),
       ('10');

INSERT IGNORE INTO User_Favorite (id_user, id_favorite) 
VALUES ('2', '1'),
       ('3', '2'),
       ('4', '3'),
       ('5', '4'),
       ('6', '5'),
       ('7', '6'),
       ('8', '7'),
       ('9', '8'),
       ('10', '9'),
       ('2', '10');
