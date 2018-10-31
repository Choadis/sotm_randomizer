DROP DATABASE SotMDB;
CREATE DATABASE SotMDB;
USE SotMDB;

DROP TABLE IF EXISTS hero;
DROP TABLE IF EXISTS villian;
DROP TABLE IF EXISTS environment;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS decksOwned;

CREATE TABLE hero (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE villian (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE environment (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE users (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `userName` varchar(16) NOT NULL UNIQUE,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE decksOwned (
  `userID` int(16) NOT NULL AUTO_INCREMENT,
  `deckName` varchar(45) NOT NULL,
  -- PRIMARY KEY (`id`)
);

INSERT INTO `hero` VALUES ()

INSERT INTO `villain` VALUES ()

INSERT INTO `environment` VALUES ()
