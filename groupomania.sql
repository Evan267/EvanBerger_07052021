-- MySQL dump 10.13  Distrib 8.0.24, for macos11 (x86_64)
--
-- Host: localhost    Database: groupomania
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `publicationId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `publicationId` (`publicationId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`publicationId`) REFERENCES `publications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'Salut !','2021-06-12 12:59:13','2021-06-12 12:59:13',5,1),(3,'HEY !!!!','2021-06-12 13:01:39','2021-06-12 13:01:39',6,1),(4,'Qu\'est ce qu\'il t\'arrive ?','2021-06-12 13:02:17','2021-06-12 13:02:17',6,2);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usersLiked` smallint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `publicationId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `publicationId` (`publicationId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`publicationId`) REFERENCES `publications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,3,'2021-06-12 12:57:55','2021-06-12 12:57:55',1),(2,5,'2021-06-12 12:59:14','2021-06-12 12:59:14',1),(3,6,'2021-06-12 13:01:24','2021-06-12 13:01:24',1),(4,6,'2021-06-12 13:01:26','2021-06-12 13:01:26',2),(5,1,'2021-06-12 13:05:10','2021-06-12 13:05:10',1),(6,5,'2021-06-12 13:05:45','2021-06-12 13:05:45',3),(7,3,'2021-06-12 13:06:06','2021-06-12 13:06:06',3);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `image` varchar(150) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `publications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications`
--

LOCK TABLES `publications` WRITE;
/*!40000 ALTER TABLE `publications` DISABLE KEYS */;
INSERT INTO `publications` VALUES (1,'Bienvenue tout le monde !!','http://localhost:3000/images/publications/bienvn-15.gif1623502667315.gif','2021-06-12 12:57:47','2021-06-12 12:57:47',3),(2,'Trop heureuse ce matin','http://localhost:3000/images/publications/gif-anime.gif1623502807259.gif','2021-06-12 13:00:07','2021-06-12 13:00:07',5),(3,'Lancement de notre premier produit à l\'international !!','http://localhost:3000/images/publications/Rotating_earth_(large).gif1623502982954.gif','2021-06-12 13:03:02','2021-06-12 13:03:02',6);
/*!40000 ALTER TABLE `publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `image` varchar(150) DEFAULT 'http://localhost:3000/images/users/default.jpg',
  `isAdmin` varchar(255) DEFAULT 'false',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'groupomania@admin.com','$2b$10$LWM2gWmKji4v.K1x4MGs2O96onBg2W7e3aydTfZGZDbna298OWjbi','Administrateur','Groupomania','1970-02-01','http://localhost:3000/images/users/default.jpg','true','2021-06-12 12:47:40','2021-06-12 12:47:40'),(3,'evan.berger@outlook.com','$2b$10$N61zI4xeDE4V6.mCN.UQmOxAFCQHYta5YJc6PBEXRtWNlRbovv2yG','Evan','Berger','1998-04-17','http://localhost:3000/images/users/Landscape-Color.jpeg1623502157842.jpg','false','2021-06-12 12:49:18','2021-06-12 12:49:18'),(5,'salome.brand@outlook.com','$2b$10$W6WdktO72mBayVTyczM0WuWf0R378OReYCnWlwpxUFCIOYeOOEuUy','Salome','Brand','1998-06-07','http://localhost:3000/images/users/20494859.jpeg1623502738343.jpg','false','2021-06-12 12:58:58','2021-06-12 12:58:58'),(6,'karl.wolf@outlook.com','$2b$10$VGyjNkY1S2olXRv2AkKA.uWQkOZilcRPYe1OK1kRb2EHLWt7GegIG','Karl','Wolf','1990-12-12','http://localhost:3000/images/users/default.jpg','false','2021-06-12 13:01:18','2021-06-12 13:01:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-12 15:07:41
