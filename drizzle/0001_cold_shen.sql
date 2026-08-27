ALTER TABLE `journal_entries` ADD `caseNumber` varchar(32);--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `caseStatus` enum('documented','disputed','unverified','ongoing','unresolved') DEFAULT 'disputed' NOT NULL;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `firstRecorded` varchar(96);--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `location` varchar(180);--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `timelineDate` varchar(96);--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `evidenceLevel` int DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `claim` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `documentedEvidence` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `counterargument` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `anomaly` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `theory` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `authorTake` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `relatedCaseSlugs` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `relationNote` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD CONSTRAINT `journal_entries_case_number_unique` UNIQUE(`caseNumber`);--> statement-breakpoint
CREATE INDEX `journal_entries_case_status_index` ON `journal_entries` (`caseStatus`);