import {
	PgTable,
	uuid,
	varchar,
	text,
	timestamp,
	boolean,
	integer,
	pgTable,
} from 'drizzle-orm/pg-core';
import { not, relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Users Table
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: varchar('username', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	firstName: varchar('first_name', { length: 50 }),
	lastName: varchar('last_name', { length: 50 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notes Table
export const notes = pgTable('notes', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	title: varchar('title', { length: 255 }).notNull(),
	body: text('body').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 50 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const noteTags = pgTable('note_tags', {
	id: uuid('id').primaryKey().defaultRandom(),
	noteId: uuid('note_id')
		.references(() => notes.id, { onDelete: 'cascade' })
		.notNull(),
	tagId: uuid('tag_id')
		.references(() => tags.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// users to many notes relation
export const userRelations = relations(users, ({ many }) => ({
	notes: many(notes),
}));

// many notes to one user
export const notesRelations = relations(notes, ({ one, many }) => ({
	user: one(users, {
		fields: [notes.userId],
		references: [users.id],
	}),
	noteTags: many(noteTags),
}));

// many tags to many notes
export const tagRelations = relations(tags, ({ many }) => ({
	noteTags: many(noteTags),
}));

// Junction table relations
export const noteTagsRelations = relations(noteTags, ({ one }) => ({
	note: one(notes, {
		fields: [noteTags.noteId],
		references: [notes.id],
	}),
	tag: one(tags, {
		fields: [noteTags.tagId],
		references: [tags.id],
	}),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertNoteSchema = createInsertSchema(notes);
export const selectNoteSchema = createSelectSchema(notes);

export const insertTagSchema = createInsertSchema(tags);
export const selectTagSchema = createSelectSchema(tags);

export const insertNoteTagSchema = createInsertSchema(noteTags);
export const selectNoteTagSchema = createSelectSchema(noteTags);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewHabit = typeof notes.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type NoteTag = typeof noteTags.$inferSelect;
export type NewNoteTag = typeof noteTags.$inferInsert;
