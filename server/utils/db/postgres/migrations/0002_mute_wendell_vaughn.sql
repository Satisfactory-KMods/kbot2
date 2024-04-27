CREATE TABLE IF NOT EXISTS "kbot2"."download_files" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"download_id" bigserial NOT NULL,
	"name" varchar(512) NOT NULL,
	"mime" varchar(64) NOT NULL,
	"size" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "download_files_download_id_index" ON "kbot2"."download_files" ("download_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_providerAccountId_index" ON "kbot2"."account" ("providerAccountId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."downloads" ADD CONSTRAINT "downloads_uploaded_by_account_providerAccountId_fk" FOREIGN KEY ("uploaded_by") REFERENCES "kbot2"."account"("providerAccountId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."download_files" ADD CONSTRAINT "download_files_download_id_downloads_id_fk" FOREIGN KEY ("download_id") REFERENCES "kbot2"."downloads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
