import { 
  users, tenants, conversations, messages, appointments, subscriptions,
  type User, type InsertUser, type Tenant, type InsertTenant,
  type Conversation, type InsertConversation, type Message, type InsertMessage,
  type Appointment, type InsertAppointment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User & Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tenant
  getTenant(id: string): Promise<Tenant | undefined>;
  getTenantBySlug(slug: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, updates: Partial<InsertTenant>): Promise<Tenant>;
  
  // Chat
  getConversations(tenantId: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Appointments
  getAppointments(tenantId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Tenant
  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async getTenantBySlug(slug: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug));
    return tenant;
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(insertTenant).returning();
    return tenant;
  }
  
  async updateTenant(tenantId: string, updates: Partial<InsertTenant>): Promise<Tenant> {
    const [tenant] = await db.update(tenants)
      .set(updates)
      .where(eq(tenants.id, tenantId))
      .returning();
    return tenant;
  }

  // Chat
  async getConversations(tenantId: string): Promise<Conversation[]> {
    return await db.select()
      .from(conversations)
      .where(eq(conversations.tenantId, tenantId))
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: number, tenantId?: string): Promise<Conversation | undefined> {
    const [conv] = await db.select().from(conversations).where(
      and(
        eq(conversations.id, id),
        eq(conversations.tenantId, tenantId)
      )
    );
    return conv;
  }

  async createConversation(conv: Omit<InsertConversation, "tenantId"> & { tenantId: string }): Promise<Conversation> {
    const [newConv] = await db.insert(conversations).values({ ...conv, tenantId: conv.tenantId }).returning();
    return newConv;                                                                                       
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.tenantId, tenants.id)
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(msg: InsertMessage): Promise<Message> {
    const [newMsg] = await db.insert(messages).values(msg).returning();
    
    // Update conversation timestamp
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(
        and(
          eq(conversations.id, msg.conversationId),
          eq(conversations.tenantId, msg.tenantId)
        )
      );
      
    return newMsg;
  }
  
  // Appointments
  async getAppointments(tenantId: string): Promise<Appointment[]> {
    return await db.select()
      .from(appointments)
      .where(eq(appointments.tenantId, tenantId))
      .orderBy(desc(appointments.startTime));
  }

  async createAppointment(appt: Omit<InsertAppointment, "tenantId"> & { tenantId: string }): Promise<Appointment> {
    const [newAppt] = await db.insert(appointments).values(appt).returning();
    return newAppt;
  }
}

export const storage = new DatabaseStorage();
