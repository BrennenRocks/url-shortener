CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"long_url" text NOT NULL,
	"short_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
