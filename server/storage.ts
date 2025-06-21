import { 
  users, projects, projectSnapshots, samples, chatMessages,
  type User, type InsertUser, type Project, type InsertProject,
  type ProjectSnapshot, type InsertProjectSnapshot, type Sample, type InsertSample,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Project snapshot operations
  getProjectSnapshots(projectId: number): Promise<ProjectSnapshot[]>;
  createProjectSnapshot(snapshot: InsertProjectSnapshot): Promise<ProjectSnapshot>;

  // Sample operations
  getSamples(): Promise<Sample[]>;
  getSamplesByCategory(category: string): Promise<Sample[]>;
  createSample(sample: InsertSample & { userId: number }): Promise<Sample>;

  // Chat operations
  getChatMessages(projectId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage & { userId: number }): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async createProject(project: InsertProject & { userId: number }): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  async getProjectSnapshots(projectId: number): Promise<ProjectSnapshot[]> {
    return await db
      .select()
      .from(projectSnapshots)
      .where(eq(projectSnapshots.projectId, projectId))
      .orderBy(desc(projectSnapshots.createdAt));
  }

  async createProjectSnapshot(snapshot: InsertProjectSnapshot): Promise<ProjectSnapshot> {
    const [newSnapshot] = await db
      .insert(projectSnapshots)
      .values(snapshot)
      .returning();
    return newSnapshot;
  }

  async getSamples(): Promise<Sample[]> {
    return await db
      .select()
      .from(samples)
      .where(eq(samples.isPublic, true))
      .orderBy(samples.category, samples.name);
  }

  async getSamplesByCategory(category: string): Promise<Sample[]> {
    return await db
      .select()
      .from(samples)
      .where(and(eq(samples.category, category), eq(samples.isPublic, true)))
      .orderBy(samples.name);
  }

  async createSample(sample: InsertSample & { userId: number }): Promise<Sample> {
    const [newSample] = await db
      .insert(samples)
      .values(sample)
      .returning();
    return newSample;
  }

  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.projectId, projectId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage & { userId: number }): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
