CREATE TABLE `journal_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(96) NOT NULL,
	`slug` varchar(112) NOT NULL,
	`description` text,
	`color` varchar(24) NOT NULL DEFAULT '#1d5671',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `journal_categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `journal_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`categoryId` int,
	`title` varchar(220) NOT NULL,
	`slug` varchar(240) NOT NULL,
	`evidenceMode` varchar(96) NOT NULL DEFAULT 'Cultural myth',
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`driveSourceUrl` text,
	`driveRenderUrl` text,
	`imageCaption` text,
	`fontId` varchar(64) NOT NULL DEFAULT 'cormorant',
	`paletteId` varchar(64) NOT NULL DEFAULT 'limestone',
	`symbol` varchar(32) NOT NULL DEFAULT '𓂀',
	`vectorMark` varchar(64) NOT NULL DEFAULT 'grid',
	`stickerMotif` varchar(64) NOT NULL DEFAULT 'scarab-eye',
	`stickyTitle` varchar(140),
	`stickyBody` text,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`featured` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `journal_entries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `journal_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entryId` int NOT NULL,
	`label` varchar(220) NOT NULL,
	`url` text NOT NULL,
	`note` text,
	`position` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journal_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `journal_entries_status_index` ON `journal_entries` (`status`);--> statement-breakpoint
CREATE INDEX `journal_entries_category_index` ON `journal_entries` (`categoryId`);--> statement-breakpoint
CREATE INDEX `journal_sources_entry_index` ON `journal_sources` (`entryId`);