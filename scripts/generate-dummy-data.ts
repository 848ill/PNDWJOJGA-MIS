// scripts/generate-dummy-data.ts
import { faker } from '@faker-js/faker';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client'; // From new admin-client file
import { v4 as uuidv4 } from 'uuid';

// Define types to fix 'implicit any' errors
type Role = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type NewUser = {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
};


async function main() {
  const supabase = createAdminSupabaseClient();
  console.log('Seeding database...');

  // Get existing roles and categories
  const { data: rolesData, error: rolesError } = await supabase.from('roles').select('id, name');
  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
    return;
  }
  const roles: Role[] = rolesData;

  const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('id, name');
  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return;
  }
  const categories: Category[] = categoriesData;

  const newUsers: NewUser[] = [];
  
  // Generate random users based on roles (excluding system_admin)
  roles.forEach((role: Role) => {
    if (role.name !== 'system_admin') {
      for (let i = 0; i < 5; i++) { // Generate 5 users for each role
        const fullName = faker.person.fullName();
        newUsers.push({
          id: uuidv4(),
          email: faker.internet.email({ firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] }).toLowerCase(),
          full_name: fullName,
          role_id: role.id,
        });
      }
    }
  });

  // Generate some random complaints
  const newComplaints = [];
  if (newUsers.length > 0) {
    for (let i = 0; i < 200; i++) {
        const randomUser = faker.helpers.arrayElement(newUsers);
        const randomCategory = faker.helpers.arrayElement(categories);
        const diyBounds = {
            north: -7.54,
            south: -8.2,
            east: 110.84,
            west: 110.0,
        };
        const latitude = faker.location.latitude({ min: diyBounds.south, max: diyBounds.north });
        const longitude = faker.location.longitude({ min: diyBounds.west, max: diyBounds.east });
        newComplaints.push({
            category_id: randomCategory.id,
            text_content: faker.lorem.sentence(),
            sentiment: faker.helpers.arrayElement(['Positive', 'Negative', 'Neutral']),
            status: faker.helpers.arrayElement(['open', 'in progress']),
            priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
            latitude: latitude,
            longitude: longitude,
            // FIX: Use recent dates to make the data relevant for "this week" queries.
            submitted_at: faker.date.recent({ days: 10 }).toISOString(),
        });
    }
  }


  // Insert users into auth and public users table
  for (const u of newUsers) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: u.full_name }
    });

    if (authError) {
        console.error(`Error creating auth user ${u.email}:`, authError.message);
    } else if (authUser.user) {
        const { error: usersInsertError } = await supabase.from('users').insert({
            id: authUser.user.id, // Use the ID from the created auth user
            full_name: u.full_name,
            email: u.email,
            role_id: u.role_id
        });
        if (usersInsertError) {
            console.error(`Error inserting user profile for ${u.email}:`, usersInsertError.message);
            // Clean up the auth user if the profile insert fails
            await supabase.auth.admin.deleteUser(authUser.user.id);
        }
    }
  }
  console.log('Users seeded.');


  const { error: complaintsInsertError } = await supabase.from('complaints').insert(newComplaints);
  if (complaintsInsertError) console.error('Error inserting complaints:', complaintsInsertError);
  else console.log('Complaints seeded.');

  console.log('Database seeding complete.');
}

main();