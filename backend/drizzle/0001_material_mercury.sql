DROP TABLE `PriceCard`;--> statement-breakpoint
ALTER TABLE `TimeLog` ADD `valueType` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `TimeLog` ADD `amount` integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `TimeLog` ADD `stampIcon` text;