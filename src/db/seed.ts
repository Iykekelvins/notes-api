import { fileURLToPath } from 'url';
import { db } from './connection.ts';
import { users, notes, tags, noteTags } from './schema.ts';
import { hashPassword } from '../utils/password.ts';

async function seed() {
	console.log('🌱 Starting database seed...');

	try {
		// Step 1: Clear existing data (order matters!)
		console.log('Clearing existing data...');
		await db.delete(noteTags); // Delete junction table
		await db.delete(notes); // Delete notes
		await db.delete(tags); // Delete tags
		await db.delete(users); // Delete users last

		// Step 2: Create foundation data
		console.log('Creating demo users...');
		const hashedPassword = await hashPassword('demo123');

		const [demoUser] = await db
			.insert(users)
			.values({
				email: 'demo@noteapp.com',
				username: 'demouser',
				password: hashedPassword,
				firstName: 'Demo',
				lastName: 'User',
			})
			.returning();

		// Step 3: Create tags for categorization
		console.log('Creating tags...');
		const [healthTag] = await db.insert(tags).values({ name: 'Health' }).returning();

		const [productivityTag] = await db
			.insert(tags)
			.values({ name: 'Productivity' })
			.returning();

		// Step 4: Create notes with relationships
		console.log('Creating demo notes...');
		const [exercisenote] = await db
			.insert(notes)
			.values({
				userId: demoUser.id,
				title: 'Note one',
				body: 'Body of my note',
			})
			.returning();

		// Step 5: Create many-to-many relationships
		await db
			.insert(noteTags)
			.values([{ noteId: exercisenote.id, tagId: healthTag.id }]);

		const today = new Date();
		today.setHours(12, 0, 0, 0);

		// Step 7: Test relational queries
		console.log('\n🔍 Testing relational queries...');
		const userWithnotes = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, 'demo@noteapp.com'),
			with: {
				notes: {
					with: {
						noteTags: {
							with: { tag: true },
						},
					},
				},
			},
		});

		console.log('✅ Database seeded successfully!');
		console.log('\n📊 Seed Summary:');
		console.log(`- Demo user has ${userWithnotes?.notes.length || 0} notes`);
		console.log('\n🔑 Login Credentials:');
		console.log('Email: demo@noteapp.com');
		console.log('Password: demo123');
	} catch (error) {
		console.error('❌ Seed failed:', error);
		throw error;
	}
}

// Run seed if this file is executed directly
if (fileURLToPath(import.meta.url) === process.argv[1]) {
	seed()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}

export default seed;
