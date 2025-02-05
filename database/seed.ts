import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
import { RepeatPeriod, DayOfWeek } from '~/types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get test user credentials from environment variables
const testUserEmail = process.env.EXPO_PUBLIC_TEST_USER_EMAIL;
const testUserPassword = process.env.EXPO_PUBLIC_TEST_USER_PASSWORD;

export const seedTasks = async (pieces: number) => {
  const user = await authenticateTestUser();
  if (!user) {
    return;
  }
  const tasks = Array.from({ length: pieces }, () => {
    const repeatType = faker.helpers.arrayElement([
      'Daily',
      'Weekly',
      'Monthly',
      'Yearly',
      null,
    ]) as RepeatPeriod | null;

    return {
      title: faker.word.verb(9) + ' ' + faker.word.noun(9),
      // randomly skip some notes
      notes: Math.random() > 0.6 ? faker.lorem.words({ min: 5, max: 16 }) : null,
      repeat_period: repeatType,
      created_at: faker.date.past({ years: 2 }),
      updated_at: faker.date.past({ years: 1 }),
      is_complete: Math.random() > 0.6 ? true : false,
      repeat_on_wk: repeatType === 'Weekly' ? [getRandomDayOfWeek()] : null,
      repeat_frequency: getRandomFrequency(repeatType),
      user_id: user.id,
    };
  });

  // Insert tasks into the database
  const { data: insertedTasks, error: insertError } = await supabase
    .from('tasks')
    .insert(tasks)
    .select();

  if (insertError) {
    console.error('Error seeding database with tasks:', insertError);
    return;
  }

  const checklistItems = insertedTasks.flatMap((task) => {
    return Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, (_, index) => ({
      content: faker.word.verb(9) + ' ' + faker.word.noun(9),
      task_id: task.id,
      position: index,
    }));
  });

  // randomly skip some checklist inserts

  const checklistItemsToInsert = checklistItems.filter(() => Math.random() > 0.6);

  const { data: insertedChecklistItems, error: checklistError } = await supabase
    .from('checklistitems')
    .insert(checklistItemsToInsert)
    .returns();

  if (checklistError) {
    console.error('Error seeding database with checklist items:', checklistError);
  } else {
    console.log(
      'Database seeded successfully with tasks and checklist items:',
      insertedChecklistItems
    );
  }
};

async function authenticateTestUser() {
  // Check if test user credentials are provided
  if (!testUserEmail || !testUserPassword) {
    console.error(
      'Test user email or password not found in environment variables. Please set EXPO_PUBLIC_TEST_USER_EMAIL and EXPO_PUBLIC_TEST_USER_PASSWORD in your .env file.'
    );
    return null;
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: testUserEmail,
    password: testUserPassword,
  });

  if (authError) {
    console.error('Authentication error:', authError);
    return null;
  }

  const user = authData.user;
  if (!user) {
    console.error('User not found after authentication');
    return null;
  }

  return user;
}

function getRandomDayOfWeek() {
  const daysOfWeek: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return daysOfWeek[faker.number.int({ min: 1, max: daysOfWeek.length })];
}

function getRandomFrequency(repeatType: RepeatPeriod | null) {
  if (repeatType === null) {
    return null;
  } else if (repeatType === 'Daily' || repeatType === 'Weekly') {
    return faker.number.int({ min: 1, max: 15 });
  } else if (repeatType === 'Monthly') {
    return faker.number.int({ min: 1, max: 6 });
  } else if (repeatType === 'Yearly') {
    return 1;
  }
}

// Get the number of tasks to seed from the command line arguments
const numberOfTasks = parseInt(process.argv[2]);

// Check if the argument is a valid number
if (isNaN(numberOfTasks) || numberOfTasks <= 0) {
  console.error(
    'Please provide a valid number of tasks to seed as a command line argument (e.g., "pnpm seed 12").'
  );
} else {
  seedTasks(numberOfTasks);
}
