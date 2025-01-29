alter table "public"."task_completion_history" enable row level security;

create policy "select_own_task_completion_history"
on "public"."task_completion_history"
as permissive
for select
to public
using ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.user_id = auth.uid()))));



