import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const seedTasks = async (numEntries) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'asdfafga@ff.gg',
    password: '123qweasd',
  });

  if (authError) {
    console.error('Authentication error:', authError);
    return;
  }

  const user = authData.user;
  if (!user) {
    console.error('User not found after authentication');
    return;
  }

  const tasks = Array.from({ length: numEntries }, () => ({
    title: faker.word.verb(9) + ' ' + faker.word.noun(9),
    notes: faker.lorem.words(9),
    user_id: user.id, // Use the authenticated user's ID
  }));

  // Insert tasks into the database
  const { data: insertedTasks, error: insertError } = await supabase.from('tasks').insert(tasks).select();

  if (insertError) {
    console.error('Error seeding database with tasks:', insertError);
    return;
  }

  // Create checklist items for each task
  const checklistItems = insertedTasks.flatMap(task => {
    return Array.from({ length: 3 }, (_, index) => ({
      content: faker.word.verb(9) + ' ' + faker.word.noun(9),
      task_id: task.id,
      position: index,
    }));
  });

  // Insert checklist items into the database
  const { data: insertedChecklistItems, error: checklistError } = await supabase.from('checklistitems').insert(checklistItems);

  if (checklistError) {
    console.error('Error seeding database with checklist items:', checklistError);
  } else {
    console.log('Database seeded successfully with tasks and checklist items:', insertedChecklistItems);
  }
};

seedTasks(3);
