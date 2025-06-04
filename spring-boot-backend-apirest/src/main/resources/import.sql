

/* Creamos algunos usuarios con sus roles */
INSERT INTO security.usersbank (aboutme, city, country, document,documents_aprov ,email, fist_name, last_name, moneyclean, password, postal, status, username) VALUES ("", "", "", "15263654","{\"foto\":false,\"fromt\":false,\"back\":false}", "develop@dev.com", "Develop", "Dev Deverp", 54, "$2a$10$RmdEsvEfhI7Rcm9f/uZXPebZVCcPC7ZXZwV51efAvMAp1rIaRAfPK", "", 1, "Develop");
INSERT INTO security.usersbank (aboutme, city, country, document, email, fist_name, last_name, moneyclean, password, postal, status, username,manage) VALUES("", "", "", "15263654", "admin@segurityinvestment.com", "Administrator", "admin admin", 1003, "$2a$10$C3Uln5uqnzx/GswADURJGOIdBqYrly9731fnwKDaUdBkt/M3qvtLq", "", 1, "Administrator",1);


INSERT INTO security.rolsbank (name) VALUES('ROLE_USER');
INSERT INTO security.rolsbank (name) VALUES('ROLE_ADMIN');


INSERT INTO security.usersbank_rols (user_entity_id, rols_id) VALUES(1, 1);


INSERT INTO security.usersbank_rols (user_entity_id, rols_id) VALUES(2, 2);

