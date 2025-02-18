CREATE UNIQUE INDEX unique_user ON public.health_and_happiness USING btree (user_id);

alter table "public"."health_and_happiness" add constraint "unique_user" UNIQUE using index "unique_user";


