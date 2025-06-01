-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 192.168.2.48    Database: Checkaroo
-- ------------------------------------------------------
-- Server version	5.5.62-0+deb8u1

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
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Account` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `balance` float DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `fk_Account_1_idx` (`user_id`),
  CONSTRAINT `fk_Account_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
INSERT INTO `Account` VALUES (1,'Arvest Checking',0,'KevinBollman');
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (3,'Test Category');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Clients`
--

DROP TABLE IF EXISTS `Clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Clients` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Clients`
--

LOCK TABLES `Clients` WRITE;
/*!40000 ALTER TABLE `Clients` DISABLE KEYS */;
INSERT INTO `Clients` VALUES (3,'Test Client'),(4,'Another Company');
/*!40000 ALTER TABLE `Clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Logins`
--

DROP TABLE IF EXISTS `Logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Logins` (
  `loginid` int(11) NOT NULL AUTO_INCREMENT,
  `session_hash` varchar(512) NOT NULL,
  `user_id` varchar(45) NOT NULL,
  `LoginDT` varchar(45) DEFAULT NULL,
  `ExpireDT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`loginid`),
  KEY `fk_Logins_1_idx` (`user_id`),
  CONSTRAINT `fk_Logins_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Logins`
--

LOCK TABLES `Logins` WRITE;
/*!40000 ALTER TABLE `Logins` DISABLE KEYS */;
INSERT INTO `Logins` VALUES (4,'testing','KevinBollman',' ',NULL),(5,'testing','KevinBollman',' ',NULL),(6,'testing','KevinBollman','',NULL),(7,'testing','KevinBollman','',NULL),(8,'testing','KevinBollman','',NULL),(9,'U2FsdGVkX18fwsb7BZPBK%2BlROQ%2BNo%2F%2Bh8EKZ8%2FwHreBPIyHCz5ODJxFm7HvpG700Buok3P69ZCVNtW5sMg1sCDXW%2BS3Wss6Sw3p3t888876oZVqoXWhIV2FxJAcyPbv4wfTRNcMRKFKzkGhB%2BpbfrkuLFWNVACB%2F3MvJA7uuFWCVFkspnb2053Y5UpyC1Xd2','KevinBollman','2025-4-31 function getHours() { [native code]',NULL),(10,'U2FsdGVkX1%2FvCANGKw5nOeX%2B2pfRNMnkWMDf3gEviPmlvQr%2FjHk6IGFUKD8rR3yur93YQHyMAI%2B9cNuAvknJQIJ3fDoC4LO8iaGTi1I3LhH35LGoFlJ%2BGIMHcrNNvgxViS7dpPhDQmcF8QnVpmHwEsimNrP3bjmA0wn31qN8nPHJWTW1jdfLMYy28lgfWi70','KevinBollman','2025-4-31 13:17:function getSeconds() { [nati',NULL),(11,'U2FsdGVkX187Bnk3El6BYvAR3%2FcX2T9Xh7Oo1w5If2KuRjR47ThJ%2ByzHmcEyAgmMN9ejnWZ%2BdOgqzoAw0djnIKOAtgAPbulnyksYjUXo9rjNO3ItL4s7igZrFlKvEKI8l6xCAf0z%2BYxost9NDoLjzBONMWkU9rLbMU6jiP6DBNjE4YyXLs8UyrywDatyB55b','KevinBollman','2025-4-31 13:18:6',NULL),(12,'U2FsdGVkX183awdKoT12olaJRgr63xe3rhFsNJfw5LBh5kp3X9y3QHiM%2B1Uum2ZzjHzVJxI1hiQ%2FUIBtf4OBVT1VqpOwfF54VbIFrKVhocQ4xhDJ%2BdOuPOkX0EiytlpMIsg4AmpuPYncSIdQwN%2FgtDld6OGXmSy8YLnn2qP3KvD%2BevsRsjrifEQscDsptqHU','KevinBollman','2025-5-31 13:18:56',NULL),(13,'U2FsdGVkX1%2BgiF4Ny7bnFSmbq749kJIDN5NcyHOQ7fOX7MaCGRJbXTuMphWmAQal5NvfKFxn2bloCq%2FCDyrz8WJ1wVBjXPjbJdY%2B6FQlI4iZjMu1n%2BFRMcHYo%2BGT926%2FeXUwAGqL0bZmbmt9GHcEqvjEdW4qxUwUih61KKD6LeLOn60fdSTJ3BHk3MlWSQ79','KevinBollman','2025-5-31 13:23:54',NULL),(14,'U2FsdGVkX1%2FKXL87G9f2xk2VACZAEzHYP4eZI1E0GsocjlirzXOK3b8tI36yEqFv5F%2FYTYcF3xscQfsm0DakQ%2Bh1P5UYHabLx13jpQDDoi0B9nEgmrRi8dD0mndZ%2BhepoLW4fw8Nrh9vYsCTGR40zMIOphCnIMieQ9kqE%2FxnAheFjEBxMvVPbsgztTCzWFJK','KevinBollman','2025-5-31 13:24:14',NULL),(15,'U2FsdGVkX1%2B4K6pHadz%2BwVavI8bleEL0nq9AjCANvCE%2F54nURv2RQhz%2FAwTpU%2FCIYCn1g7hEpmnkBQIG2iCVUH6NR8%2B8aLSMMd35q6i18Ir0xikWXNQ2v6X1GH6G%2FXrQspQk38lpCwyhsJAcg27nV8ZkN8E8X6itAAm7IpToSX3YqhQ6JIN%2FVE0HvKcDZJyt','KevinBollman','2025-5-31 13:24:20',NULL),(16,'U2FsdGVkX18f%2BjpTW2potwJ0ZVLf6PvcgzDirHcb6Flhr%2ByFXm5KGydF%2FruwTiQb7THNZt1UYeH2JFPgddlJ7%2F2%2FXITFJNF2qxAqmr6j9ZV6ilKSFCeY%2Fk%2F%2B6NgaeHZkuusxO6xL%2BCVLEt7mC%2BQU6J3aHT32xdqSQannp6qo4B1%2FG1i7hcN5SeuETe4hBbHO','KevinBollman','2025-5-31 14:54:15',NULL),(17,'U2FsdGVkX1%2FcoZFV2tHfmCdC5zwVDNc1tLes0ieTv4sxHXHtqjA2%2Fxgm0niEOs%2FDQRDYIF8MuJzKjarDp5Gq2xZihORGehBlufpZZacqIMs3Os0kbuhI5r0XfPEieGZxxeQ4fwXnaN6tjF99fVLW48h9mgNaylj31suRwSCsjb6qGBpnwGclFYq3rkvAWcR3','KevinBollman','2025-5-31 16:41:7',NULL),(18,'U2FsdGVkX1%2FjlMcEJ3W5HeJmc0hpxohejgnIA2%2BynJ8eGP96e5SxhO3QaP0qbP1Hr6dAJRFrte1F24eyRVI8WbRHdFJZpUhF9%2BZ%2BbP5qfhpwNdWfgA1gaTiIkzq6na5k','KevinBollman','2025-5-31 16:45:10',NULL),(20,'U2FsdGVkX18r6K%2BVnHKjFebdB27KsMMxQY1DeAJqqN%2FZ8vwRolhszx8kr4jSLUVERQHE2K4jZDZh8AMWVPX9iqJ4ohe59wdWhw%2F5c%2BHnpup4PUiTYMlD%2FvAeYuUN4Njo','KevinBollman','2025-5-31 18:2:14',NULL),(21,'U2FsdGVkX1%2Bb%2FDK7bTuq2UGB2imdZ4xorRXEnS6T4%2F64gpHysgAyRak9GtHSBcToZ8i11Ymkd1rAdKWAKh%2FLyJPvthKuQtscSVYyX%2FJmDjn6TGQDOj53nRUzGxOf3iyh','KevinBollman','2025-5-31 18:4:58',NULL),(22,'U2FsdGVkX19dyyF2rPwZBlqpMkbCgAJiaoQ5u%2BeKTZ9g8tu%2FBJFS%2FE1IVKWnBy%2BZZ4TnO%2FBkiXnPzJHYQ0849PsWjwhuMcm7NdZZ5THbFr03YUNeef%2BGdLIUPz8lTXKt','KevinBollman','2025-5-31 18:5:11',NULL),(23,'U2FsdGVkX1%2BBZpwiRsyC7yN8xg17%2F6IRXm0DPzDMdSvchcfhBN80sB5ppi6hSPaBI%2BLhz7Rmv6NUZ2%2FVLZrc67W%2BO4Y9hodJjuWalFkn7695qkhB5Y1oSBbAwJqflG2W','KevinBollman','2025-5-31 18:6:4',NULL),(24,'U2FsdGVkX1%2FJAlp%2BpTOw8wrAmL%2FVS72zQQQZq%2FTYU7hJIpqSGu5sAMSntNhkS1IVpid2LlkM2EAU5sKx8sgVFsfKY%2Fk1gjmHKf3SITYSw8eEYofH1c1mzS7PQy8KtW6J','KevinBollman','2025-5-31 18:7:1',NULL),(25,'U2FsdGVkX1%2FQS93yLenkcpNDX9KHsIgDfUBYnF%2BU6SJmHIyyQK1OfzMj0i07i29iH%2FE8KM75XV3SLvNheSaBOzuHjXAZln5KemeEV%2BlIfxEj2Fq8mA%2FemYfkXt8m6G02','KevinBollman','2025-5-31 18:10:6',NULL),(26,'U2FsdGVkX18ysWNkz1yw1xMtkMMPxi1nhAWihwMyIKU%2BBPV0K%2FdU6Yyf04rEyDt%2BU7OIhp035I%2BIfxxe5fLPTxhRa6QLpNAc77HG3T%2B2IDxOVnzNLEcwJsoc5NdgPf4b','KevinBollman','2025-5-31 18:10:33',NULL),(27,'U2FsdGVkX18MLjEuBulGDD86xLNCmv1Pvb1AbzQlQVeB2SiZMK6KCA2W%2B2ewVJvHULySEb4gAuQzxnDEhC7nD92kXouVCyvf9c5pvoakyMoUqalIZiy4Z7gXpnnu4bOA','KevinBollman','2025-5-31 18:10:49',NULL),(28,'U2FsdGVkX19YBRDjnGJS6Ss78sounNkSxq17kT5m%2BIM%2FXUR19J9ZcbgIMFo2%2FX4%2FJZSQbpJ9WEW%2FFE%2BGXtPhzXagbLEGdiBZvtP8vtVISbeBB5sqTI7jOevfqHqyD%2FQg','KevinBollman','2025-5-31 18:12:5',NULL),(29,'U2FsdGVkX19eZfISx4yn7DQDaOkRJHBtelb4LErW%2BXPXO4e0DxyD6qiUHipfA9fDWyDAU1rHtqXDLc4sgmRNbvKQ945ofDdT%2FIoIjDtALW2k1eRD1i34v2NDq%2FdolKw3','KevinBollman','2025-5-31 18:12:42',NULL),(30,'U2FsdGVkX1%2FPHhbgyC3GmZdGPb1ASfv5IBARP9Qj0s%2BaMyoJ4sznbA%2BEEQ%2B1sNqAK0xOtIhymleiuAbw741zYwKOLTZzBY80ZF2g818Xn4j9Qh2bIKda%2BJhWagXkdm1Z','KevinBollman','2025-5-31 18:13:23',NULL),(31,'U2FsdGVkX1%2FYXN2lV8axfM0dMjLvJFXOACi6hFGkzkpp%2BK1WBQ%2B4s5lwxu6Ia9zyv1BUjF6%2FmuJszGcErsPDEVPd5pN1ePLSn5mhghSVOZ4x54dOkWp43ZmlT%2BNd8QfM','KevinBollman','2025-5-31 18:13:37',NULL),(32,'U2FsdGVkX1%2FAkM80EmopnMFEc5BmsxLMZ%2BALPwzCTPHvft9UBvng5S38LknjCfeDo4Q%2BR4TH0xPfLlgw%2FsLWAAzNQjkhcINL3ShZ3gh1pGHgvdheQtTB0dNhb1hahFf7','KevinBollman','2025-5-31 18:13:43',NULL),(33,'U2FsdGVkX1%2B2KQEkYZ6mCAa86jL7MiFnnNnD3c7eroguIFmmTuqJ1b8z7RJzTR1el1Ib4bbYSMSgQWC%2BdUHalv2wIWBcccfT93gY0XfzDcsc%2FG2K30S84yn5ldFozjgZ','KevinBollman','2025-5-31 18:14:24',NULL),(34,'U2FsdGVkX18YuUBjZuhtMG2wAPE5L%2B9GtmR3QLiCswScO%2F3S5yBSgsJXmgIFpWsuYwRjB0DmjOYD2V%2BfGuA3NhcDM9zsvu235zClxYsvYrzRXcB99P8aXS6b5nGlxA%2BA','KevinBollman','2025-5-31 18:14:35',NULL),(35,'U2FsdGVkX1%2F0uTPuKt88McMoS8otf7Iq2bv4pEdNh5iZmnPsRNvnIIX0MrNrxyODR9qHGE5KMPqcHohg6rPiu1X9v%2BIH%2BAY5HxLZwT9eoiuuFkvNc7aE0WAtieCnAco9','KevinBollman','2025-5-31 18:16:55',NULL),(44,'U2FsdGVkX19yvgq6L35%2F7njLLJss7zeHh6xYav30piWdlIa6EP6hI4bNL0AJiPl803jiFeLs1CXQNyR7E2Vkj3Cggm5w1O6Xlt1lsDA6EB3mWPl5KJNl8RRrfZZaGjzr','KevinBollman','2025-6-1 13:37:28','2025-06-02 01:37:28'),(45,'U2FsdGVkX1%2Bj%2FopiIAjWngC3%2BW6cn2CWoC4tu7Ya6MHxjWFUhY3siSzQ%2FJToBNyAGYZmqfP1xnLiGRTFu3YNQIKMxfWnLC4aE%2B7nddOVuzvTdqVcmA7OQBelTQMFjTur','KevinBollman','2025-6-1 7:39:45','2025-06-01 19:39:45');
/*!40000 ALTER TABLE `Logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transactions` (
  `trans_id` varchar(128) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`trans_id`),
  KEY `fk_Transactions_1_idx` (`account_id`),
  KEY `fk_Transactions_2_idx` (`category_id`),
  KEY `fk_trans_client_idx` (`client_id`),
  CONSTRAINT `fk_trans_account` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`),
  CONSTRAINT `fk_trans_cat` FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`),
  CONSTRAINT `fk_trans_client` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`
--

LOCK TABLES `Transactions` WRITE;
/*!40000 ALTER TABLE `Transactions` DISABLE KEYS */;
INSERT INTO `Transactions` VALUES ('D95A8AFE67C45',1,'2025-05-24 19:19:23',34,4,3),('D95A8AFE67C47',1,'2025-05-24 19:14:24',12,3,3);
/*!40000 ALTER TABLE `Transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` varchar(45) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `password_hash` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('KevinBollman','Kevin Bollman','5c5570b326776fd5935b729d3034d0e9');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-01 17:47:51
