CREATE TABLE `Client` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`isPrivate` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Client_userId_idx` ON `Client` (`userId`);--> statement-breakpoint
CREATE TABLE `PriceCard` (
	`id` text PRIMARY KEY NOT NULL,
	`valueType` text NOT NULL,
	`amount` integer NOT NULL,
	`stampIcon` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	`clientId` text NOT NULL,
	`taskCategoryId` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`taskCategoryId`) REFERENCES `TaskCategory`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PriceCard_clientId_taskCategoryId_key` ON `PriceCard` (`clientId`,`taskCategoryId`);--> statement-breakpoint
CREATE TABLE `RewardSetting` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`requiredLogs` integer NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `RewardSetting_userId_idx` ON `RewardSetting` (`userId`);--> statement-breakpoint
CREATE TABLE `TaskCategory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `TimeLog` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`startTime` text DEFAULT (datetime('now')) NOT NULL,
	`endTime` text,
	`isInterrupt` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`clientId` text NOT NULL,
	`taskCategoryId` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`taskCategoryId`) REFERENCES `TaskCategory`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `TimeLog_clientId_idx` ON `TimeLog` (`clientId`);--> statement-breakpoint
CREATE INDEX `TimeLog_startTime_endTime_idx` ON `TimeLog` (`startTime`,`endTime`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);