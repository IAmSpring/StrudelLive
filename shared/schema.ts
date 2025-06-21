import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().default(""),
  userId: integer("user_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  bpm: integer("bpm").default(120),
  metadata: jsonb("metadata").$type<{
    duration?: number;
    lastPlayedAt?: string;
    tags?: string[];
    description?: string;
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectSnapshots = pgTable("project_snapshots", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  code: text("code").notNull(),
  version: integer("version").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const samples = pgTable("samples", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  category: text("category").notNull(),
  duration: integer("duration"), // in milliseconds
  userId: integer("user_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  snapshots: many(projectSnapshots),
  chatMessages: many(chatMessages),
}));

export const projectSnapshotsRelations = relations(projectSnapshots, ({ one }) => ({
  project: one(projects, {
    fields: [projectSnapshots.projectId],
    references: [projects.id],
  }),
}));

export const samplesRelations = relations(samples, ({ one }) => ({
  user: one(users, {
    fields: [samples.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [chatMessages.projectId],
    references: [projects.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  code: true,
  isPublic: true,
  bpm: true,
  metadata: true,
}).partial().extend({
  name: z.string().min(1, "Project name is required"),
});

export const insertProjectSnapshotSchema = createInsertSchema(projectSnapshots).pick({
  projectId: true,
  code: true,
  version: true,
  message: true,
});

export const insertSampleSchema = createInsertSchema(samples).pick({
  name: true,
  filename: true,
  category: true,
  duration: true,
  isPublic: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  projectId: true,
  role: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProjectSnapshot = z.infer<typeof insertProjectSnapshotSchema>;
export type ProjectSnapshot = typeof projectSnapshots.$inferSelect;
export type InsertSample = z.infer<typeof insertSampleSchema>;
export type Sample = typeof samples.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
