PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_TimeLog` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`startTime` text DEFAULT (datetime('now')) NOT NULL,
	`endTime` text,
	`isInterrupt` integer DEFAULT false NOT NULL,
	`valueType` text NOT NULL,
	`amount` integer NOT NULL,
	`stampIcon` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`clientId` text NOT NULL,
	`taskCategoryId` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`taskCategoryId`) REFERENCES `TaskCategory`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_TimeLog`("id", "description", "startTime", "endTime", "isInterrupt", "valueType", "amount", "stampIcon", "createdAt", "clientId", "taskCategoryId") SELECT "id", "description", "startTime", "endTime", "isInterrupt", "valueType", "amount", "stampIcon", "createdAt", "clientId", "taskCategoryId" FROM `TimeLog`;--> statement-breakpoint
DROP TABLE `TimeLog`;--> statement-breakpoint
ALTER TABLE `__new_TimeLog` RENAME TO `TimeLog`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `TimeLog_clientId_idx` ON `TimeLog` (`clientId`);--> statement-breakpoint
CREATE INDEX `TimeLog_startTime_endTime_idx` ON `TimeLog` (`startTime`,`endTime`);--> statement-breakpoint
ALTER TABLE `Client` ADD `isActive` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `TaskCategory` ADD `isActive` integer DEFAULT true NOT NULL;