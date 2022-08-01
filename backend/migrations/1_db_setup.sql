-- MySQL dump 10.13  Distrib 8.0.21, for macos10.15 (x86_64)
--
-- Host: localhost    Database: web_test
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applicant_institution`
--

DROP TABLE IF EXISTS `applicant_institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_institution` (
  `id` char(32) NOT NULL,
  `application_id` char(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `major` varchar(255) NOT NULL,
  `cgpa` float NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `completion_status` enum('ONGOING','COMPLETED','NOT_COMPLETED') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  KEY `ix_applicant_institution_id` (`id`),
  CONSTRAINT `applicant_institution_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `id` char(32) NOT NULL,
  `program_id` char(32) NOT NULL,
  `student_id` char(32) NOT NULL,
  `reviewer_id` char(32),
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `sop` text,
  `status` enum('SUBMITTED','IN_REVIEW','APPROVED','REJECTED', 'WITHDRAWN') DEFAULT NULL,
  `language_test_id` char(32) NOT NULL,
  `resume_doc_id` char(32) NOT NULL,
  `transcript_doc_id` char(32) NOT NULL,
  `language_test_doc_id` char(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  KEY `student_id` (`student_id`),
  KEY `reviewer_id` (`reviewer_id`),
  KEY `language_test_id` (`language_test_id`),
  KEY `resume_doc_id` (`resume_doc_id`),
  KEY `transcript_doc_id` (`transcript_doc_id`),
  KEY `language_test_doc_id` (`language_test_doc_id`),
  KEY `ix_application_id` (`id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `university_program` (`id`),
  CONSTRAINT `application_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`),
  CONSTRAINT `application_ibfk_3` FOREIGN KEY (`reviewer_id`) REFERENCES `university_user` (`id`),
  CONSTRAINT `application_ibfk_4` FOREIGN KEY (`language_test_id`) REFERENCES `language_test` (`id`),
  CONSTRAINT `application_ibfk_5` FOREIGN KEY (`resume_doc_id`) REFERENCES `document` (`id`),
  CONSTRAINT `application_ibfk_6` FOREIGN KEY (`transcript_doc_id`) REFERENCES `document` (`id`),
  CONSTRAINT `application_ibfk_7` FOREIGN KEY (`language_test_doc_id`) REFERENCES `document` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document` (
  `id` char(32) NOT NULL,
  `user_id` char(32) NOT NULL,
  `type` enum('TRANSCRIPT','RESUME','LANGUAGE_TEST') DEFAULT NULL,
  `url` text,
  `name` char(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_document_id` (`id`),
  CONSTRAINT `document_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `language_test`
--

DROP TABLE IF EXISTS `language_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language_test` (
  `id` char(32) NOT NULL,
  `type` enum('IELTS','TOEFL','PTE','OTHER') NOT NULL,
  `reading` float NOT NULL,
  `writing` float NOT NULL,
  `listening` float NOT NULL,
  `speaking` float NOT NULL,
  `overall` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_language_test_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `university`
--

DROP TABLE IF EXISTS `university`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `university` (
  `id` char(32) NOT NULL,
  `description` text,
  `image_url` text,
  `status` enum('APPROVED','REJECTED','PENDING') DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_university_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `university_program`
--

DROP TABLE IF EXISTS `university_program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `university_program` (
  `id` char(32) NOT NULL,
  `university_id` char(32) NOT NULL,
  `description` text,
  `course_level` enum('GRAD','UNDER_GRAD') DEFAULT NULL,
  `requirements` text,
  `name` varchar(255) NOT NULL,
  `term_length` int NOT NULL,
  `department` varchar(255) NOT NULL,
  `fees` int NOT NULL,
  `scholarship` char(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `university_id` (`university_id`),
  KEY `ix_university_program_id` (`id`),
  CONSTRAINT `university_program_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `university_user`
--

DROP TABLE IF EXISTS `university_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `university_user` (
  `id` char(32) NOT NULL,
  `university_id` char(32) NOT NULL,
  `date_of_birth` date NOT NULL,
  `department` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `image_url` text,
  PRIMARY KEY (`id`),
  KEY `university_id` (`university_id`),
  CONSTRAINT `university_user_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`),
  CONSTRAINT `university_user_ibfk_2` FOREIGN KEY (`university_id`) REFERENCES `university` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` char(32) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` enum('ADMIN','STAFF','STUDENT','UNIVERSITY') NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `ix_user_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-23 13:38:53
