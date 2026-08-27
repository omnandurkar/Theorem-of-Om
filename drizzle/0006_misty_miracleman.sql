CREATE TABLE `curator_credentials` (
	`id` int NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curator_credentials_id` PRIMARY KEY(`id`)
);
