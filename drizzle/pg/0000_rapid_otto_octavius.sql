CREATE TYPE "public"."case_status" AS ENUM('documented', 'disputed', 'unverified', 'ongoing', 'unresolved');--> statement-breakpoint
CREATE TYPE "public"."entry_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."letter_status" AS ENUM('received', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "curator_credentials" (
	"id" integer PRIMARY KEY NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curator_puzzles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "curator_puzzles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(96) NOT NULL,
	"title" varchar(180) NOT NULL,
	"instruction" text NOT NULL,
	"clue" text NOT NULL,
	"relicIds" varchar(255) NOT NULL,
	"solutionOrder" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "journal_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(96) NOT NULL,
	"slug" varchar(112) NOT NULL,
	"description" text,
	"color" varchar(24) DEFAULT '#1d5671' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "journal_entries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"authorId" integer NOT NULL,
	"categoryId" integer,
	"title" varchar(220) NOT NULL,
	"slug" varchar(240) NOT NULL,
	"caseNumber" varchar(32),
	"caseStatus" "case_status" DEFAULT 'disputed' NOT NULL,
	"firstRecorded" varchar(96),
	"location" varchar(180),
	"era" varchar(96),
	"mapLatitude" double precision,
	"mapLongitude" double precision,
	"timelineDate" varchar(96),
	"evidenceLevel" integer DEFAULT 50 NOT NULL,
	"evidenceMode" varchar(96) DEFAULT 'Cultural myth' NOT NULL,
	"claim" text,
	"documentedEvidence" text,
	"counterargument" text,
	"anomaly" text,
	"theory" text,
	"authorTake" text,
	"relatedCaseSlugs" text,
	"relationNote" text,
	"summary" text NOT NULL,
	"body" text NOT NULL,
	"driveSourceUrl" text,
	"driveRenderUrl" text,
	"imageCaption" text,
	"fontId" varchar(64) DEFAULT 'cormorant' NOT NULL,
	"paletteId" varchar(64) DEFAULT 'limestone' NOT NULL,
	"symbol" varchar(32) DEFAULT '𓂀' NOT NULL,
	"vectorMark" varchar(64) DEFAULT 'grid' NOT NULL,
	"stickerMotif" varchar(64) DEFAULT 'scarab-eye' NOT NULL,
	"stickyTitle" varchar(140),
	"stickyBody" text,
	"stickyTreatment" varchar(32) DEFAULT 'brass-pin' NOT NULL,
	"stickyPlacement" varchar(32) DEFAULT 'margin' NOT NULL,
	"stampKind" varchar(32) DEFAULT 'auto' NOT NULL,
	"status" "entry_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"publishedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "journal_sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"entryId" integer NOT NULL,
	"label" varchar(220) NOT NULL,
	"url" text NOT NULL,
	"note" text,
	"position" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theory_letters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "theory_letters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"readerName" varchar(120) NOT NULL,
	"theory" text NOT NULL,
	"status" "letter_status" DEFAULT 'received' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE INDEX "curator_puzzles_active_index" ON "curator_puzzles" USING btree ("isActive");--> statement-breakpoint
CREATE UNIQUE INDEX "journal_categories_name_unique" ON "journal_categories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "journal_categories_slug_unique" ON "journal_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "journal_entries_slug_unique" ON "journal_entries" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "journal_entries_case_number_unique" ON "journal_entries" USING btree ("caseNumber");--> statement-breakpoint
CREATE INDEX "journal_entries_status_index" ON "journal_entries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "journal_entries_category_index" ON "journal_entries" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "journal_entries_case_status_index" ON "journal_entries" USING btree ("caseStatus");--> statement-breakpoint
CREATE INDEX "journal_sources_entry_index" ON "journal_sources" USING btree ("entryId");--> statement-breakpoint
CREATE INDEX "theory_letters_status_index" ON "theory_letters" USING btree ("status");--> statement-breakpoint
CREATE INDEX "theory_letters_created_at_index" ON "theory_letters" USING btree ("createdAt");