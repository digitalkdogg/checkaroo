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
  `account_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `fk_Category_1_idx` (`account_id`),
  CONSTRAINT `fk_Category_1` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (3,'Test Category',1);
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
  `account_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  KEY `fk_Clients_1_idx` (`account_id`),
  CONSTRAINT `fk_Clients_1` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Clients`
--

LOCK TABLES `Clients` WRITE;
/*!40000 ALTER TABLE `Clients` DISABLE KEYS */;
INSERT INTO `Clients` VALUES (3,'Test Client',1),(4,'Another Company',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Logins`
--

LOCK TABLES `Logins` WRITE;
/*!40000 ALTER TABLE `Logins` DISABLE KEYS */;
INSERT INTO `Logins` VALUES (110,'U2FsdGVkX18CznsswEerd27Ca9AVUL2RvGYTyhfNkmbEEZiESGhlFbviia4Jd%2BpEkA0yv2NgtC7PvuzN2AFx6i8trDz3tCD5y8vjfGYMsD1OQVlSA%2F%2F%2BVs1nhGwcDp0e','KevinBollman','2025-06-06 19:40:35','2025-01-01 12:00:00'),(111,'U2FsdGVkX1%2FSL0P4ykuIXoVNqCu%2BvAYzPqzh%2BsegIV49wpLLGqaM14skor4vYsvsHx%2BhZybY8LhcD7vfVKI0fIRbcHk4tiru8gVjHYrXhjevpidnlhzcpEHVlV%2FlqKR0','KevinBollman','2025-06-06 19:50:53','2025-01-01 12:00:00'),(112,'U2FsdGVkX1%2FDncXYnaZmTiTMc1QOUV8AhnQuxsS2%2F%2FMNFaHTHyisCFNxsuiFptC6waLzKDkYkHw5ul%2FGuCXTu91GmRAwRJIcSoFjnSvisnHR3oRR7jY7MUhvCzvgj7wA','KevinBollman','2025-06-06 19:59:26','2025-01-01 12:00:00'),(113,'948109fc-536f-4427-a5a7-668b4c2532bd40c82629-5a75-4860-aadc-a8c9869de518363f5c6f-3f78-423e-bf11-0fd5247a022f','KevinBollman','2025-06-07 10:52:45','2025-01-01 12:00:00'),(116,'4de37065-7128-4c84-af8a-99262520a73635e052d9-98bd-4784-b1db-91f5aed904fdcf4c4258-522b-4e79-a532-15f31846d62e','KevinBollman','2025-06-07 11:26:47','2025-01-01 12:00:00'),(117,'42b8d37d-6878-4418-b76b-4badfc1ed3171643e8e5-3d56-40a1-8b25-d39542cab6251ec44e2c-cdad-4efd-8c51-38e9875a1a31','KevinBollman','2025-06-07 11:42:05','2025-01-01 12:00:00'),(118,'f065cb05-e083-464b-890e-57e4ae0c59e1a4be6262-aae4-475f-bc18-9b0869009b91301b0e17-3628-4b5a-8692-0f6d74a3f01a','KevinBollman','2025-06-07 11:46:18','2025-01-01 12:00:00'),(119,'094c6e20-b61a-499e-b232-ab1e8fe200f91c639996-4cc5-4be3-a225-695acd41049117d2dfba-bd3e-43b2-9fb6-8907c880075d','KevinBollman','2025-06-07 11:46:50','2025-01-01 12:00:00'),(120,'ea2920eb-1219-4dc1-82d7-738b6722aed9026eccee-efde-4bd5-8cf6-deb1d7761220288fcc1d-88cd-4bde-b151-0beaac26e6f1','KevinBollman','2025-06-07 15:21:25','2025-01-01 12:00:00'),(121,'72235867-f38c-4d43-ade9-dd0cd41fb7a7aef56e05-5806-4253-af04-97772ce5ac9108da1a33-aaf2-4aaa-8101-832bcbdc573d','KevinBollman','2025-06-07 15:42:52','2025-01-01 12:00:00'),(122,'396fc7cb-f5af-4ef2-8a07-d9bef1d56822c9f1107d-b47d-44df-95f1-70f11c9d023eccf563a4-fba8-45fc-8330-4b5d740e8128','KevinBollman','2025-06-07 15:44:13','2025-01-01 12:00:00'),(123,'3ade6235-9909-4769-95d6-1d2c365a6fab0d12fb24-8f2a-4055-9d5b-e833492e083654afd342-beb1-4cd1-9d01-d034eab291ea','KevinBollman','2025-06-07 15:45:39','2025-01-01 12:00:00'),(124,'29c8eae0-4705-4a7b-8644-3eda50d25351fa73479b-f1a4-48d4-b6fd-76216b11e2129528effe-3af8-4f5f-8985-1fc227cace30','KevinBollman','2025-06-07 15:55:10','2025-01-01 12:00:00'),(125,'d3959b24-96e1-49fd-ada3-8f42114626772153e0de-031c-459d-acc6-7366f18e329857b22250-15ba-485c-be2e-ed9f71c66afe','KevinBollman','2025-06-07 18:54:47','2025-01-01 12:00:00'),(126,'d93264f1-021b-415d-8a9f-c6e2c872ff32e53f04c1-714c-422d-b2b7-6a9b6ea1f07c0c02a506-7376-41fa-8c6d-ee141b893591','KevinBollman','2025-06-07 18:55:34','2025-01-01 12:00:00'),(127,'0800b2da-18ec-4f92-afd5-f2c495b84885c654dd76-bf06-405f-90e1-1e5da07dbcac812fd606-4dcf-4a51-ad92-fd756a99e13b','KevinBollman','2025-06-08 20:09:04','2025-01-01 12:00:00'),(128,'e286b6d5-2ed3-442b-8f43-5a3f45e0fb7c5c5fb61c-b381-44a7-8b98-7b5aff62ad76012dfc96-4799-40b7-9631-2bc7f805774d','KevinBollman','2025-06-08 20:09:54','2025-01-01 12:00:00'),(129,'7df104ec-375e-44cd-b7e0-dea76237a744ff90c089-7771-4dce-a8cf-b4eaca1cf8a88be4861d-bb7a-410b-aa06-ebbd4112210c','KevinBollman','2025-06-09 09:38:50','2025-01-01 12:00:00'),(130,'95ac2d91-e981-4fd5-87a4-769ffee2057ff6967642-bd31-4989-acc7-082a69ee9d40476203f1-2c4a-4b57-b60e-82d8077bffb9','KevinBollman','2025-06-09 09:41:02','2025-01-01 12:00:00'),(131,'9459911d-3914-434f-baf2-d8aec4ea15ed98e5f597-4c6c-49f9-a43f-66c342298d6d2dcedaa4-6f9f-40e8-8aac-0dbaa6bb4755','KevinBollman','2025-06-09 09:42:28','2025-01-01 12:00:00'),(132,'a5b8ecc0-ec09-4e24-add9-b938701ec94b2ac98dae-83da-4bcb-bd4c-0c914a025f95133bcb80-d7f9-447d-b5c3-0fc11002b786','KevinBollman','2025-06-09 15:05:08','2025-01-01 12:00:00'),(133,'98a1c24e-a1a8-480e-93e4-e0a0b41768d989de22fe-d9f3-4e71-a0fd-1770a66827d5e74a3b5d-a268-4194-a3a5-a2457d18410d','KevinBollman','2025-06-09 18:01:25','2025-01-01 12:00:00'),(134,'b01bea6e-7ef5-4a83-95a6-ce6c0f64e19f6c82d60f-2c45-4a44-9af0-5eb2d34ac28778dffccb-5df0-4fdb-807c-420a50327bd6','KevinBollman','2025-06-09 18:02:09','2025-01-01 12:00:00'),(135,'226b12f8-5f86-41b8-be10-c34ad5ae3d4bae1a9f6f-a381-473a-bca8-13f22db8ebe7881c4fd9-cb63-4727-9a6c-ef468862ead7','KevinBollman','2025-06-09 18:04:23','2025-01-01 12:00:00'),(136,'cafe0122-5184-4805-b5f0-2a76775dd3787b262d81-c47a-400f-8ee4-a36910b48458635dcf49-85bd-4823-ab30-a8c11c461db5','KevinBollman','2025-06-09 18:06:16','2025-01-01 12:00:00'),(137,'0889dbc5-83a5-4c28-ae4c-407555baa17f1a8ec817-951e-4d60-b739-e0d28b53ed1677d32e55-cb52-48f4-b28d-656cd97317b7','KevinBollman','2025-06-09 18:14:41','2025-01-01 12:00:00'),(138,'f7527202-541c-4383-ac99-059759668251016a671b-f8ef-4420-88fb-b79ac84bb08bbf321afc-a64d-4744-9b6c-aacbead78e0f','KevinBollman','2025-06-09 18:18:09','2025-01-01 12:00:00'),(139,'204fc9bc-b5f8-4903-a296-656fc2796ec27ec8c382-a964-4e2a-9a6e-6688180086ca06f19615-4046-45f1-85ce-cdd461e6faa1','KevinBollman','2025-06-09 18:20:35','2025-01-01 12:00:00'),(140,'f05fe30b-ea1b-4dac-800d-1deb2a43ab50222f121b-4fc7-493b-8bde-ca58a8782a6902a4bae1-b5ed-47aa-b089-40512d483a49','KevinBollman','2025-06-10 18:57:42','2025-01-01 12:00:00'),(141,'aeb8d800-802c-43f4-b0df-59286487fdeb62b7fa3a-431e-4339-a515-81d53de38346c999600e-f03d-428c-8102-63f4c2ade654','KevinBollman','2025-06-11 18:24:33','2025-01-01 12:00:00'),(142,'ac78097b-6a9f-47e0-ba5b-eccc3277d94d20e2772f-4ea4-4c6a-a42e-7b83656e8f983317d4c6-2b07-40da-9455-d72c05e4ca18','KevinBollman','2025-06-12 17:21:23','2025-01-01 12:00:00'),(143,'829b4402-095d-4128-9920-812f05b48783fea68f58-95e1-42c9-a0ae-f769f10307ae3068c733-c7fb-4348-8523-f67aea0da63a','KevinBollman','2025-06-13 17:46:14','2025-01-01 12:00:00'),(144,'fb8a3f1c-ef40-490b-a85a-86f72f12a23209bf7d53-7298-49e9-9d28-99bd087c94e5d7d55092-b7b6-4595-902b-8d628c8d71db','KevinBollman','2025-06-14 13:21:43','2025-01-01 12:00:00'),(145,'65039604-e24f-4f0a-a2d9-11cb9b3a274334701585-ab4f-4ff4-b04c-b2f170d908d80e8c6594-542a-4a76-bbb5-c4306a5833ad','KevinBollman','2025-06-15 09:50:33','2025-01-01 12:00:00'),(146,'36a828c5-72ba-40aa-b5f4-32676873aafe9fd50605-46ea-4023-b7d8-96e380c77999b69ad0f0-d504-44e9-9f67-1966382e0d20','KevinBollman','2025-06-15 12:43:09','2025-01-01 12:00:00'),(147,'6d0373f8-4ef1-464c-9cc8-73678abc4c3cba7b42be-326b-4496-a880-6f4cb91e752c91d12638-521c-4e46-b39f-f5aaab30c63c','KevinBollman','2025-06-15 14:08:31','2025-01-01 12:00:00'),(148,'32c587c1-5935-4de7-b655-0c8a14c659e9bd7cfe41-bfc4-455c-9a0f-94dc665070de264c97be-d7a5-462e-b018-19a68e14d134','KevinBollman','2025-06-16 17:26:35','2025-01-01 12:00:00'),(149,'9e7e2df4-8f38-4c9a-aefc-ea315de5be1d7e898a5c-c4a6-496c-87ba-bb94aba063d891f69250-3f97-4cd4-a8bd-21b4f2540d9f','KevinBollman','2025-06-17 20:19:11','2025-01-01 12:00:00'),(150,'c252883c-26ea-4289-b39d-7cc5691aac55f55de358-cda7-4cc8-9cf4-16dab904353dbc9556d8-b9ec-4944-954a-f9a5ad918f82','KevinBollman','2025-06-20 07:02:27','2025-01-01 12:00:00'),(151,'dab767fa-3869-446f-8f5c-7de45c7a0329f6a7098d-f702-4dc2-a197-b6692977b73a12ef04bb-cea0-46e8-a590-c3272c3e27c7','KevinBollman','2025-06-20 20:07:09','2025-01-01 12:00:00'),(152,'f30e65ab-494a-4de6-9334-450b975d65e49c299d93-168b-4975-aa33-936da8d27df029691f21-e753-4822-b72d-28bd9b626462','KevinBollman','2025-06-21 10:58:03','2025-01-01 12:00:00'),(153,'36caae8d-b3f1-441d-858a-22b3898de1a89328e839-2163-468c-95b2-6fe63103808abc2a0dae-89f1-4b01-9750-9e98046c0007','KevinBollman','2025-06-21 18:03:00','2025-01-01 12:00:00'),(154,'235fd405-5542-41db-8237-10e59f2684627187ed75-36f1-4ecd-a0d5-fa4f4045ad72bebe063b-6cf6-44ca-afdf-2fe47474d163','KevinBollman','2025-06-21 19:31:05','2025-01-01 12:00:00'),(155,'a5cb392d-b541-41c5-8c3d-86557ccc1ac578d67a54-424a-4429-b6c6-9cc30ec02ca159ab62be-26ab-4e98-bb9f-5322a9d39240','KevinBollman','2025-06-21 20:26:46','2025-01-01 12:00:00'),(156,'03481bf7-f1f8-4518-a865-a321eaaba8f1c08e054e-1229-4c45-8f63-cbf37061b4026be79f3f-822c-4875-a6ec-0730d32e760e','KevinBollman','2025-06-22 09:10:33','2025-01-01 12:00:00'),(157,'e780e005-dec6-4a56-a06e-a485ed6087b230a96924-c041-4471-96d0-b978506e1c6164333a6f-fe95-4f9c-a790-0bbb55e4586e','KevinBollman','2025-06-22 18:02:54','2025-06-23 06:02:54');
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

-- Dump completed on 2025-06-22 20:14:34
