CREATE TABLE `curator_puzzles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(96) NOT NULL,
	`title` varchar(180) NOT NULL,
	`instruction` text NOT NULL,
	`clue` text NOT NULL,
	`relicIds` varchar(255) NOT NULL,
	`solutionOrder` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curator_puzzles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `curator_puzzles_active_index` ON `curator_puzzles` (`isActive`);