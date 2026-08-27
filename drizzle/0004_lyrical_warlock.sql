CREATE TABLE `theory_letters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`readerName` varchar(120) NOT NULL,
	`theory` text NOT NULL,
	`status` enum('received','read','archived') NOT NULL DEFAULT 'received',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `theory_letters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `theory_letters_status_index` ON `theory_letters` (`status`);--> statement-breakpoint
CREATE INDEX `theory_letters_created_at_index` ON `theory_letters` (`createdAt`);