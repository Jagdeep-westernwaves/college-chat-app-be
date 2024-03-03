-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2024 at 06:54 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demo`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatmsg`
--

CREATE TABLE `chatmsg` (
  `id` int(11) NOT NULL,
  `sId` int(11) DEFAULT 0,
  `rId` int(11) DEFAULT 0,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isActive` int(11) DEFAULT 1,
  `CloneMsg` varchar(255) DEFAULT '',
  `mediaName` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chatmsg`
--

INSERT INTO `chatmsg` (`id`, `sId`, `rId`, `createAt`, `isActive`, `CloneMsg`, `mediaName`) VALUES
(1, 1, 2, '2022-06-15 23:10:57', 1, 'as xmsjxk', ''),
(2, 2, 1, '2022-06-15 23:11:13', 1, 'as xmsjxk', ''),
(3, 2, 1, '2022-06-15 23:11:24', 1, 'as xmsjxk', ''),
(4, 1, 2, '2022-06-15 23:11:32', 1, '[value-3]', ''),
(5, 2, 1, '2022-06-15 23:39:21', 1, 'jhdwjd', ''),
(6, 2, 1, '2022-06-15 23:39:25', 1, 'jhdwjdd', ''),
(7, 2, 1, '2022-06-15 23:39:26', 1, 'jhdwjdd', ''),
(8, 2, 1, '2022-06-15 23:40:14', 1, 'wdmw demc e', ''),
(9, 2, 1, '2022-06-15 23:40:17', 1, 'wdmw demc e,d ew w', ''),
(10, 2, 1, '2022-06-15 23:40:33', 1, 'wdmw demc e,d ew w', ''),
(11, 2, 1, '2022-06-15 23:41:50', 1, 'hey', ''),
(12, 2, 1, '2022-06-15 23:43:13', 1, 'wkejdwld', ''),
(13, 2, 1, '2022-06-15 23:43:19', 1, 'wkejdwld', ''),
(14, 2, 1, '2022-06-15 23:43:24', 1, 'bxbxs', ''),
(15, 2, 1, '2022-06-16 00:24:55', 1, '\'ewwe', ''),
(16, 2, 1, '2022-06-16 00:24:56', 1, '\'ewwee', ''),
(17, 2, 1, '2022-06-16 00:24:56', 1, '\'ewweefew', ''),
(18, 2, 1, '2022-06-16 00:24:56', 1, '\'ewweefewwe', ''),
(19, 2, 1, '2022-06-16 00:24:57', 1, '\'ewweefewwefwe', ''),
(20, 2, 1, '2022-06-16 00:24:57', 1, '\'ewweefewwefwewefwe', ''),
(21, 2, 1, '2022-06-16 00:24:59', 1, '\'ewweefewwefwewefwe', ''),
(22, 2, 1, '2022-06-16 00:24:59', 1, '\'ewweefewwefwewefwe', ''),
(23, 2, 1, '2022-06-16 00:24:59', 1, '\'ewweefewwefwewefwe', ''),
(24, 2, 1, '2022-06-16 00:25:00', 1, '\'ewweefewwefwewefwe', ''),
(25, 2, 1, '2022-06-16 00:25:00', 1, '\'ewweefewwefwewefwe', ''),
(26, 2, 1, '2022-06-16 00:25:00', 1, '\'ewweefewwefwewefwe', ''),
(27, 2, 1, '2022-06-16 00:25:00', 1, '\'ewweefewwefwewefwe', ''),
(28, 2, 1, '2022-06-16 00:25:01', 1, '\'ewweefewwefwewefwe', ''),
(29, 2, 1, '2022-06-16 00:29:25', 1, 'aa', ''),
(30, 2, 1, '2022-06-16 00:29:26', 1, 'aa', ''),
(31, 2, 1, '2022-06-16 00:29:26', 1, 'aa', ''),
(32, 2, 1, '2022-06-16 00:29:26', 1, 'aa', ''),
(33, 2, 1, '2022-06-16 00:29:26', 1, 'aa', ''),
(34, 2, 1, '2022-06-16 00:29:27', 1, 'aa', ''),
(35, 2, 1, '2022-06-16 00:29:27', 1, 'aa', ''),
(36, 2, 1, '2022-06-16 00:29:27', 1, 'aa', ''),
(37, 2, 1, '2022-06-16 00:29:27', 1, 'aa', ''),
(38, 2, 1, '2022-06-16 00:29:27', 1, 'aa', ''),
(39, 2, 1, '2022-06-16 00:29:33', 1, 'aa', ''),
(40, 2, 1, '2022-06-16 00:29:33', 1, 'aa', ''),
(41, 2, 1, '2022-06-16 00:29:34', 1, 'aa', ''),
(42, 2, 1, '2022-06-16 00:29:34', 1, 'aa', ''),
(43, 2, 1, '2022-06-16 00:29:34', 1, 'aa', ''),
(44, 2, 1, '2022-06-16 00:32:47', 1, 'mdlwek', ''),
(45, 2, 1, '2022-06-16 00:32:50', 1, 'mdlwek', ''),
(46, 2, 1, '2022-06-16 00:32:50', 1, 'mdlwek', ''),
(47, 2, 1, '2022-06-16 00:32:50', 1, 'mdlwek', ''),
(48, 2, 1, '2022-06-16 00:32:51', 1, 'mdlwek', ''),
(49, 2, 1, '2022-06-16 00:35:21', 1, 'asnkjdqw', ''),
(50, 2, 1, '2022-06-16 00:35:23', 1, 'asnkjdqw', ''),
(51, 2, 1, '2022-06-16 00:35:30', 1, 'asnkjdqw', ''),
(52, 2, 1, '2022-06-16 00:35:33', 1, 'asnkjdqwKSNOLNK', ''),
(53, 3, 1, '2022-06-16 01:01:35', 1, 'hello', ''),
(54, 3, NULL, '2022-06-16 01:02:11', 1, 'hello', ''),
(55, 3, NULL, '2022-06-16 01:02:12', 1, 'hello', ''),
(56, 3, NULL, '2022-06-16 01:02:12', 1, 'hello', ''),
(57, 3, 1, '2022-06-16 01:03:23', 1, 'hey', ''),
(58, 2, 3, '2022-06-16 01:03:45', 1, 'hey', ''),
(59, 3, 2, '2022-06-16 01:03:58', 1, 'hello', ''),
(60, 2, 3, '2022-06-16 01:04:09', 1, 'how are you', ''),
(61, 3, 2, '2022-06-16 01:05:43', 1, 'fewkfnekfn', ''),
(62, 2, 3, '2022-06-16 01:05:56', 1, 'qqqq', ''),
(63, 2, 3, '2022-06-16 01:06:27', 1, 'hello gg', ''),
(64, 2, 4, '2022-10-12 03:14:30', 1, 'hello sir kida', '');

-- --------------------------------------------------------

--
-- Table structure for table `commentpost`
--

CREATE TABLE `commentpost` (
  `id` int(11) NOT NULL,
  `commentDate` timestamp NULL DEFAULT current_timestamp(),
  `uid` int(11) DEFAULT 0,
  `pId` int(11) DEFAULT 0,
  `commentValue` varchar(255) DEFAULT '',
  `sts` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eventmng`
--

CREATE TABLE `eventmng` (
  `id` int(11) NOT NULL,
  `edate` datetime NOT NULL DEFAULT current_timestamp(),
  `name` varchar(50) NOT NULL DEFAULT '',
  `mno` varchar(15) NOT NULL DEFAULT '0',
  `remarks` varchar(1000) NOT NULL DEFAULT '',
  `isactive` decimal(1,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `frnd`
--

CREATE TABLE `frnd` (
  `id` int(11) NOT NULL,
  `lid` int(11) NOT NULL DEFAULT 0,
  `fid` int(11) NOT NULL DEFAULT 0,
  `confirm` decimal(1,0) DEFAULT 0,
  `req` decimal(1,0) DEFAULT 0,
  `dateofjoin` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `frnd`
--

INSERT INTO `frnd` (`id`, `lid`, `fid`, `confirm`, `req`, `dateofjoin`) VALUES
(2, 1, 6, '1', '1', '2022-04-08 00:09:57'),
(3, 1, 3, '1', '1', '2022-04-08 00:10:01'),
(5, 3, 4, '1', '1', '2022-04-08 00:10:40'),
(7, 3, 6, '1', '1', '2022-04-08 00:13:45'),
(8, 6, 4, '1', '1', '2022-04-08 11:14:34'),
(9, 6, 5, '0', '1', '2022-04-08 11:14:41'),
(10, 6, 2, '1', '1', '2022-04-08 11:14:42'),
(11, 3, 7, '1', '1', '2022-05-23 20:47:23'),
(12, 7, 1, '1', '1', '2022-05-23 20:50:39'),
(13, 7, 2, '1', '1', '2022-05-23 20:50:41'),
(14, 7, 4, '1', '1', '2022-05-23 20:50:43'),
(15, 7, 5, '0', '1', '2022-05-23 20:50:44'),
(16, 7, 6, '0', '1', '2022-05-23 20:50:45'),
(19, 1, 2, '1', '1', '2022-06-14 18:08:01'),
(20, 1, 4, '1', '1', '2022-06-14 18:08:02'),
(21, 1, 5, '0', '1', '2022-06-14 18:08:04'),
(22, 1, 10, '0', '1', '2022-06-14 18:08:05'),
(24, 4, 2, '1', '1', '2022-06-16 00:34:45'),
(25, 3, 2, '1', '1', '2022-06-16 06:15:49'),
(26, 3, 5, '0', '1', '2022-06-16 07:49:59'),
(27, 13, 1, '0', '1', '2024-02-25 21:24:38'),
(28, 13, 2, '1', '1', '2024-02-25 21:24:39'),
(29, 13, 3, '0', '1', '2024-02-25 21:24:40'),
(30, 13, 4, '0', '1', '2024-02-25 21:24:43'),
(31, 13, 5, '0', '1', '2024-02-25 21:24:44'),
(32, 13, 6, '0', '1', '2024-02-25 21:24:45'),
(33, 13, 7, '0', '1', '2024-02-25 21:24:46'),
(34, 13, 11, '0', '1', '2024-02-25 21:24:46'),
(35, 13, 12, '0', '1', '2024-02-25 21:24:50'),
(36, 2, 5, '0', '1', '2024-02-25 21:46:08');

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `uploading_time` datetime DEFAULT NULL,
  `url` varchar(255) NOT NULL DEFAULT '/',
  `title` varchar(50) NOT NULL DEFAULT '',
  `isactive` decimal(1,0) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `imgapi`
--

CREATE TABLE `imgapi` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '',
  `imgdir` varchar(255) NOT NULL DEFAULT '',
  `isactive` decimal(1,0) NOT NULL,
  `upld_date` datetime NOT NULL DEFAULT current_timestamp(),
  `uid` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `likeposts`
--

CREATE TABLE `likeposts` (
  `id` int(11) NOT NULL,
  `uid` int(11) DEFAULT 0,
  `pId` int(11) DEFAULT 0,
  `likedTime` timestamp NULL DEFAULT current_timestamp(),
  `sts` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `likeposts`
--

INSERT INTO `likeposts` (`id`, `uid`, `pId`, `likedTime`, `sts`) VALUES
(1, 2, 1, '2022-06-14 18:30:00', 1),
(2, 4, 5, '2022-06-14 18:30:00', 1),
(3, 4, 5, '2022-06-14 18:30:00', 1),
(4, 4, 5, '2022-06-14 18:30:00', 1),
(5, 4, 5, '2022-06-14 18:30:00', 1),
(6, 4, 3, '2022-06-14 18:30:00', 1),
(7, 4, 3, '2022-06-14 18:30:00', 1),
(8, 4, 1, '2022-06-14 18:30:00', 1),
(9, 4, 1, '2022-06-14 18:30:00', 1),
(10, 4, 1, '2022-06-14 18:30:00', 0),
(11, 4, 1, '2022-06-14 18:30:00', 1),
(12, 4, 1, '2022-06-14 18:30:00', 0),
(13, 4, 1, '2022-06-14 18:30:00', 1),
(14, 4, 1, '2022-06-14 18:30:00', 0),
(15, 4, 1, '2022-06-14 18:30:00', 1),
(16, 4, 1, '2022-06-14 18:30:00', 0),
(17, 4, 1, '2022-06-14 18:30:00', 1),
(18, 4, 1, '2022-06-14 18:30:00', 1),
(19, 4, 1, '2022-06-14 18:30:00', 1),
(20, 4, 1, '2022-06-15 15:30:59', 0),
(21, 4, 1, '2022-06-15 15:31:00', 1),
(22, 4, 1, '2022-06-15 17:01:16', 0),
(23, 4, 1, '2022-06-15 17:01:24', 0),
(24, 4, 1, '2022-06-15 17:02:27', 0),
(25, 4, 1, '2022-06-15 17:02:28', 1),
(26, 4, 3, '2022-06-15 17:02:37', 0),
(27, 4, 1, '2022-06-15 17:02:51', 0),
(28, 4, 1, '2022-06-15 17:12:53', 0),
(29, 4, 5, '2022-06-15 17:16:29', 0),
(30, 4, 3, '2022-06-15 17:16:34', 1),
(31, 4, 5, '2022-06-15 17:16:38', 0),
(32, 4, 4, '2022-06-15 17:16:42', 0),
(33, 4, 4, '2022-06-15 17:18:19', 1),
(34, 4, 4, '2022-06-15 17:18:23', 0),
(35, 4, 4, '2022-06-15 17:18:25', 0),
(36, 4, 4, '2022-06-15 17:18:26', 0),
(37, 4, 4, '2022-06-15 17:18:37', 0),
(38, 4, 4, '2022-06-15 17:23:20', 0),
(39, 4, 1, '2022-06-15 17:23:30', 0),
(40, 4, 5, '2022-06-15 17:23:58', 0),
(41, 4, 4, '2022-06-15 17:24:15', 1),
(42, 4, 1, '2022-06-15 17:25:17', 0),
(43, 4, 1, '2022-06-15 17:26:08', 1),
(44, 4, 1, '2022-06-15 17:27:39', 0),
(45, 4, 1, '2022-06-15 17:32:28', 0),
(46, 4, 3, '2022-06-15 17:34:02', 0),
(47, 4, 1, '2022-06-15 17:34:10', 0),
(48, 4, 3, '2022-06-15 17:34:17', 1),
(49, 4, 1, '2022-06-15 17:34:35', 0),
(50, 4, 1, '2022-06-15 17:34:41', 1),
(51, 4, 1, '2022-06-15 17:35:08', 0),
(52, 4, 1, '2022-06-15 17:35:09', 1),
(53, 4, 3, '2022-06-15 17:35:12', 0),
(54, 4, 5, '2022-06-15 17:35:15', 0),
(55, 4, 1, '2022-06-15 17:35:19', 0),
(56, 4, 1, '2022-06-15 17:35:33', 0),
(57, 4, 5, '2022-06-15 17:38:07', 0),
(58, 4, 5, '2022-06-15 17:38:23', 0),
(59, 4, 1, '2022-06-15 17:48:01', 0),
(60, 4, 1, '2022-06-15 18:04:22', 1),
(61, 4, 5, '2022-06-15 18:04:31', 1),
(62, 4, 3, '2022-06-15 18:05:01', 1),
(63, 4, 3, '2022-06-15 18:05:12', 0),
(64, 4, 2, '2022-06-15 18:16:28', 1),
(65, 4, 2, '2022-06-15 18:16:28', 0),
(66, 4, 2, '2022-06-15 18:16:32', 1),
(67, 4, 2, '2022-06-15 18:16:40', 0),
(68, 2, 13, '2022-10-12 02:34:18', 0),
(69, 2, 13, '2022-10-12 02:34:24', 0),
(70, 2, 6, '2022-10-12 02:34:40', 0),
(71, 2, 5, '2022-10-12 02:34:54', 1),
(72, 2, 6, '2022-10-12 02:36:00', 1),
(73, 2, 13, '2022-10-12 02:36:12', 1),
(74, 2, 14, '2022-10-12 02:36:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT '',
  `uname` varchar(50) NOT NULL DEFAULT '',
  `pswd` varchar(50) NOT NULL DEFAULT '',
  `mno` varchar(15) NOT NULL DEFAULT '0',
  `email` varchar(50) NOT NULL DEFAULT '',
  `join_date` datetime NOT NULL DEFAULT current_timestamp(),
  `isactive` decimal(1,0) DEFAULT 0,
  `bio` varchar(1000) NOT NULL DEFAULT 'Write something about You....',
  `pimg` varchar(999) NOT NULL DEFAULT '/'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `newsevents`
--

CREATE TABLE `newsevents` (
  `id` int(11) NOT NULL,
  `newstitle` varchar(100) NOT NULL DEFAULT '',
  `newsdescr` varchar(1000) NOT NULL DEFAULT 'write something about you',
  `createat` datetime DEFAULT current_timestamp(),
  `isactive` decimal(1,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `newsevents`
--

INSERT INTO `newsevents` (`id`, `newstitle`, `newsdescr`, `createat`, `isactive`) VALUES
(1, 'Hello World', 'Hey there', '2022-01-12 11:33:50', '1');

-- --------------------------------------------------------

--
-- Table structure for table `postmanager`
--

CREATE TABLE `postmanager` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL DEFAULT 0,
  `posttitle` varchar(300) NOT NULL DEFAULT '',
  `postDes` varchar(1000) NOT NULL DEFAULT '',
  `privacysts` decimal(1,0) NOT NULL DEFAULT 0,
  `isactive` decimal(1,0) NOT NULL DEFAULT 0,
  `postimg` varchar(1000) NOT NULL DEFAULT '',
  `createat` datetime NOT NULL DEFAULT current_timestamp(),
  `updateat` datetime NOT NULL DEFAULT current_timestamp(),
  `posttag` varchar(200) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `postmanager`
--

INSERT INTO `postmanager` (`id`, `uid`, `posttitle`, `postDes`, `privacysts`, `isactive`, `postimg`, `createat`, `updateat`, `posttag`) VALUES
(1, 4, 'fgggg', '', '1', '1', 'test1653421046012.PNG', '2022-05-25 01:07:26', '2022-05-25 01:07:26', ''),
(2, 6, 'hello Darling', '', '0', '1', 'test1653422157685.jpg', '2022-05-25 01:25:57', '2022-05-25 01:25:57', ''),
(3, 4, 'hello Darling', '', '0', '1', 'test1654413749470.jpeg', '2022-06-05 12:52:29', '2022-06-05 12:52:29', ''),
(4, 4, 'hello Darling', '', '0', '1', 'test1654413749496.jpeg', '2022-06-05 12:52:29', '2022-06-05 12:52:29', ''),
(5, 4, 'hello Darling', '', '0', '1', 'test1654413749846.jpeg', '2022-06-05 12:52:29', '2022-06-05 12:52:29', ''),
(6, 2, 'vcffcfcf', '', '0', '1', 'test1655326443470.PNG', '2022-06-16 02:24:03', '2022-06-16 02:24:03', ''),
(7, 2, 'vcffcfcf', '', '0', '1', 'test1655326508717.mp4', '2022-06-16 02:25:08', '2022-06-16 02:25:08', ''),
(8, 2, 'aaa', '', '0', '1', 'test1655326569482.png', '2022-06-16 02:26:09', '2022-06-16 02:26:09', ''),
(9, 2, 'aaas', '', '1', '1', 'test1655326723100.jpg', '2022-06-16 02:28:43', '2022-06-16 02:28:43', ''),
(10, 2, 'qwdkwqdj', '', '0', '1', 'test1655326849548.mp4', '2022-06-16 02:30:49', '2022-06-16 02:30:49', ''),
(11, 2, 'qwdkwqdj', '', '1', '1', 'test1655327046418.png', '2022-06-16 02:34:06', '2022-06-16 02:34:06', ''),
(12, 2, 'fgggg', '', '0', '1', 'test1655327171254.jpg', '2022-06-16 02:36:11', '2022-06-16 02:36:11', ''),
(13, 2, 'vcffcfcf', '', '0', '1', 'test1655327663103.jpg', '2022-06-16 02:44:23', '2022-06-16 02:44:23', ''),
(14, 2, 'Good Morning', '', '1', '1', 'test1665541370044.jpg', '2022-10-12 07:52:50', '2022-10-12 07:52:50', ''),
(15, 13, 'wedding girl', '', '1', '1', 'test1708876275187.JPG', '2024-02-25 21:21:15', '2024-02-25 21:21:15', ''),
(16, 13, 'wedding girl', '', '1', '1', 'test1708876297595.JPG', '2024-02-25 21:21:37', '2024-02-25 21:21:37', ''),
(17, 13, 'testing', '', '1', '1', 'test1708888522145.JPG', '2024-02-26 00:45:22', '2024-02-26 00:45:22', '');

-- --------------------------------------------------------

--
-- Table structure for table `reftoken`
--

CREATE TABLE `reftoken` (
  `uid` int(11) NOT NULL,
  `reftoken` varchar(1000) NOT NULL DEFAULT '',
  `createat` datetime DEFAULT current_timestamp(),
  `sts` decimal(1,0) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `slider`
--

CREATE TABLE `slider` (
  `id` int(11) NOT NULL,
  `imgpath` varchar(1000) NOT NULL DEFAULT '',
  `title` varchar(100) NOT NULL DEFAULT '',
  `createat` datetime DEFAULT current_timestamp(),
  `modifyat` datetime DEFAULT current_timestamp(),
  `isactive` decimal(1,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbllog`
--

CREATE TABLE `tbllog` (
  `id` int(11) NOT NULL,
  `gid` varchar(150) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `imgname` varchar(1000) NOT NULL DEFAULT 'default.png',
  `picBgoogle` varchar(190) NOT NULL DEFAULT 'default.png',
  `email` varchar(100) NOT NULL DEFAULT '',
  `cverify` int(11) NOT NULL DEFAULT 0,
  `mobno` varchar(15) NOT NULL DEFAULT '0',
  `uname` varchar(100) NOT NULL DEFAULT '',
  `pswd` varchar(100) NOT NULL DEFAULT '',
  `reftoken` varchar(1000) NOT NULL,
  `join_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` decimal(1,0) NOT NULL DEFAULT 0,
  `isactive` decimal(1,0) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbllog`
--

INSERT INTO `tbllog` (`id`, `gid`, `name`, `imgname`, `picBgoogle`, `email`, `cverify`, `mobno`, `uname`, `pswd`, `reftoken`, `join_date`, `status`, `isactive`) VALUES
(1, '105085818924980255936', ' jagdeep sharma', 'profile.PNG', 'https://lh3.googleusercontent.com/a-/AOh14GgKbZutoT5CMij3DZ4iTU58u0mbeI7-pqrlATjh=s96-c', 'jagdeepsharma.seo@gmail.com ', 2504, '0', 'jagdeep1001', '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlciI6ImphZ2RlZXAxMDAxIiwiaWF0IjoxNjU2MjI0MzQwfQ.l9do_KnNVLqNA8LjjkBqMj27W9gD4E8rqP2i4oaHfDY', '2022-02-20 18:22:09', '1', '1'),
(2, '102099235562939997828', '  Jagdeep Sharma', 'default.png', 'https://lh3.googleusercontent.com/a-/AOh14GidykTkB3Sn-B6GFH5OSdyf-QnFPB6ErscC80UG=s96-c', 'jagdeepshere@gmail.com', 0, '32224444', 'admin', '1122', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwidXNlciI6ImFkbWluIiwiaWF0IjoxNzA4ODAwMTYzfQ.LJQ1iYEekLjlEPpW4QrZLVFdTAgsh7PmKAOvtdumRec', '2022-02-20 18:22:09', '1', '1'),
(3, '', 'Anjali', 'cropped-purpul-version-1.png', '', 'anjali@admin.com', 0, '098765431', 'anjali', '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MywidXNlciI6ImFuamFsaSIsImlhdCI6MTY1NTM0MDMyMH0.arJAhUqO4fsdkjJYhIkUUElQLLBoThV8-SvwObPgiQ4', '2022-02-20 18:22:09', '0', '1'),
(4, '', 'jagdeep sharma', 'IMG-20201130-WA0026.jpg', '', 'nehashere@admin.com', 0, '0987654321', 'Jagdeep1122', '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6NCwidXNlciI6IkphZ2RlZXAxMTIyIiwiaWF0IjoxNjU2ODM4MzE3fQ.UqO-InaT0qaxL2nRG2FzCmRejs3j6NxUVddIggAXI5E', '2022-02-20 18:22:09', '1', '1'),
(5, '113288736836267013473', 'jagdeep sharma', 'default.png', 'https://lh3.googleusercontent.com/a-/AOh14GhL8ZOeZyaUMoVqKz2gmkd9_D36SC5H5OBSNsuJGOY=s96-c', 'jagdeepsharma1122@gmail.com', 0, '0', 'jaggi', '1122', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjU0NDQ4NTI3fQ.em4J9n0_YLeeVMGfjiiZs39qbnvIVKZ_HtKKf09AUpY', '2022-02-21 05:31:12', '1', '1'),
(6, '', 'demo', 'default.png', '', 'sss@ddd.ccc', 7489, '1234567890', 'demo', '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6NiwidXNlciI6ImRlbW8iLCJpYXQiOjE2NTM0MjIxMzZ9.Jes80QqU5CsgRCc-fKUtCcaRFBvxng1bxjrw8tR1lng', '2022-02-22 16:36:45', '0', '1'),
(7, '', 'tysss', 'default.png', '', 'jagdeepshere@gmail.com', 2647, '1234567890', 'tysss', '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6NywidXNlciI6InR5c3NzIiwiaWF0IjoxNjU1MjEwMzgyfQ.K63t15kd5IS3TQRou2EGTa8UGl8OBAVYgpFth64ORsY', '2022-04-08 06:49:30', '0', '1'),
(11, '113529389374969946773', 'Queen Doll', 'default.png', 'https://lh3.googleusercontent.com/a/ALm5wu1MfEdJrerQlL9NdSixxttolt0i4oAhHEM-wKFz=s96-c', 'thanksqueendoll@gmail.com', 0, '0', '', '', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY2NjgxMTc2OH0.-f2Jaf3nc4NVChKi-kEJ9KwRBydIrCVmt2YZ1Bzt4Tw', '2022-10-26 19:16:08', '1', '1'),
(12, '113529389374969946773', 'Aarti Sharma', 'default.png', 'https://lh3.googleusercontent.com/a/ALm5wu1MfEdJrerQlL9NdSixxttolt0i4oAhHEM-wKFz=s96-c', 'jagdeepshere@gmail.com', 0, '0', '', '', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY2NjgxMTc2OH0.-f2Jaf3nc4NVChKi-kEJ9KwRBydIrCVmt2YZ1Bzt4Tw', '2022-10-26 19:16:08', '1', '1'),
(13, '', 'Jagdeep', 'DSC04875 (1).JPG', 'default.png', 'jagdeep.sharma@softelevation.com', 0, '7986203611', 'Test', '1122', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTMsInVzZXIiOiJUZXN0IiwiaWF0IjoxNzA4ODAwNDg0fQ.krvXYNhQcCw3fEfp1O2IMl4yzle9UQeBuA2HvHi4x18', '2024-02-24 18:47:41', '0', '1');

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL DEFAULT 0,
  `token` varchar(1000) NOT NULL DEFAULT '',
  `createat` datetime DEFAULT current_timestamp(),
  `sts` decimal(1,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ts`
--

CREATE TABLE `ts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '',
  `des` varchar(1000) NOT NULL,
  `isactive` decimal(1,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ts`
--

INSERT INTO `ts` (`id`, `name`, `title`, `des`, `isactive`) VALUES
(1, 'test', 'test', 'testing', '1'),
(2, 'rest', 'Test', 'Testing  ', '1');

-- --------------------------------------------------------

--
-- Table structure for table `tsimg`
--

CREATE TABLE `tsimg` (
  `id` int(11) NOT NULL,
  `tsid` int(11) NOT NULL DEFAULT 0,
  `imgpath` varchar(1000) NOT NULL DEFAULT '',
  `title` varchar(100) NOT NULL DEFAULT '',
  `createat` datetime DEFAULT current_timestamp(),
  `modifyat` datetime DEFAULT current_timestamp(),
  `isactive` decimal(1,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tsimg`
--

INSERT INTO `tsimg` (`id`, `tsid`, `imgpath`, `title`, `createat`, `modifyat`, `isactive`) VALUES
(1, 1, 'default.png', '1', '2022-01-12 13:11:57', '2022-01-12 13:11:57', '1'),
(2, 1, 'default.png', '2', '2022-01-12 13:12:12', '2022-01-12 13:12:12', '1'),
(3, 1, 'spot1645366355723.PNG', 'test', '2022-02-20 19:42:35', '2022-02-20 19:42:35', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatmsg`
--
ALTER TABLE `chatmsg`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commentpost`
--
ALTER TABLE `commentpost`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eventmng`
--
ALTER TABLE `eventmng`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `frnd`
--
ALTER TABLE `frnd`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `imgapi`
--
ALTER TABLE `imgapi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likeposts`
--
ALTER TABLE `likeposts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsevents`
--
ALTER TABLE `newsevents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `postmanager`
--
ALTER TABLE `postmanager`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reftoken`
--
ALTER TABLE `reftoken`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `slider`
--
ALTER TABLE `slider`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbllog`
--
ALTER TABLE `tbllog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts`
--
ALTER TABLE `ts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tsimg`
--
ALTER TABLE `tsimg`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatmsg`
--
ALTER TABLE `chatmsg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `commentpost`
--
ALTER TABLE `commentpost`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventmng`
--
ALTER TABLE `eventmng`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `frnd`
--
ALTER TABLE `frnd`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `imgapi`
--
ALTER TABLE `imgapi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likeposts`
--
ALTER TABLE `likeposts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsevents`
--
ALTER TABLE `newsevents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `postmanager`
--
ALTER TABLE `postmanager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `reftoken`
--
ALTER TABLE `reftoken`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slider`
--
ALTER TABLE `slider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbllog`
--
ALTER TABLE `tbllog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ts`
--
ALTER TABLE `ts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tsimg`
--
ALTER TABLE `tsimg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
