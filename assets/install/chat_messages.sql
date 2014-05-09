CREATE TABLE `chat_messages` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`user_id` varchar(255) NOT NULL DEFAULT '',
	`room_id` int(11) NOT NULL,
	`message` text,
	`client_ip` varchar(100) DEFAULT NULL,
	`created_at` datetime DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;