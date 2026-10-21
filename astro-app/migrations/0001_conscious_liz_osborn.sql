CREATE TABLE `Competitions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`event_ids` text NOT NULL,
	`venue` text NOT NULL,
	`country_iso2` text NOT NULL,
	`has_results` integer DEFAULT false NOT NULL,
	`cancelled_at` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MemberWcaData` (
	`wcaid` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Members` (
	`wcaid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatarUrl` text NOT NULL,
	`country` text,
	`gender` text,
	`role` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Requests` (
	`wcaid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatarUrl` text NOT NULL,
	`country` text,
	`gender` text,
	`role` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`wcaid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatarUrl` text NOT NULL,
	`country` text,
	`gender` text,
	`email` text,
	`emailConsent` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
