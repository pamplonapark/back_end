USE pamplonapark;

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

INSERT IGNORE INTO Parkings (id, name, address, hours_active, available_spots, latitude, spots, telephone, longitude) VALUES
(1,'Parking1', 'Address1', '9:00 AM - 5:00 PM', '50', '40.730610', '50', '1234567890', '-73.935242'),
(2,'Parking2', 'Address2', '24 hours', '100', '40.712776', '100', '1234567891', '-74.005974'),
(3, 'Parking3', 'Address3', '8:00 AM - 6:00 PM', '75', '40.739940', '75', '1234567892', '-73.990134'),
(4, 'Parking4', 'Address4', '24 hours', '200', '40.748817', '200', '1234567893', '-73.985428'),
(5, 'Parking5', 'Address5', '10:00 AM - 8:00 PM', '80', '40.758896', '80', '1234567894', '-73.985130'),
(6, 'Parking6', 'Address6', '6:00 AM - 10:00 PM', '150', '40.706086', '150', '1234567895', '-74.010953'),
(7, 'Parking7', 'Address7', '24 hours', '300', '40.721110', '300', '1234567896', '-73.987632'),
(8, 'Parking8', 'Address8', '7:00 AM - 7:00 PM', '120', '40.751358', '120', '1234567897', '-73.987137'),
(9, 'Parking9', 'Address9', '24 hours', '250', '40.759011', '250', '1234567898', '-73.984472'),
(10, 'Parking10', 'Address10', '8:00 AM - 9:00 PM', '90', '40.743079', '90', '1234567899', '-73.993237');

INSERT IGNORE INTO User_Favorite (id_user, id_favorite) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9),
(4, 10);