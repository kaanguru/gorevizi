alter table "public"."tasks" drop column "repeat_fre";

alter table "public"."tasks" drop column "repeat_perd";

alter table "public"."tasks" add column "repeat_frequency" smallint;

alter table "public"."tasks" add column "repeat_period" repeat_period;


