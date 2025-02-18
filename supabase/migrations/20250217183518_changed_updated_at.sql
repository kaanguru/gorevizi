alter table "public"."health_and_happiness" drop column "created_at";

alter table "public"."health_and_happiness" add column "updated_at" timestamp with time zone default now();


