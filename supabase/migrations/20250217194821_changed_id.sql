alter table "public"."health_and_happiness" alter column "id" set data type smallint using "id"::smallint;

create policy "insert_own_task_completion_history"
on "public"."task_completion_history"
as permissive
for insert
to authenticated
with check ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.user_id = auth.uid()))));



