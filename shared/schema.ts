import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TENANTS ===
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // subdomain or identifier
  branding: jsonb("branding").$type<{
    logoUrl?: string;
    accentColor?: string;
    font?: string;
    voiceStyle?: string;
  }>().default({}),
  businessHours: jsonb("business_hours").$type<Record<string, { start: string; end: string } | null>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// === USERS ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable for super-admins? Or enforcing tenant_id? User said "Every table includes tenant_id"
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role", { enum: ["OWNER", "ADMIN", "VIEWER"] }).notNull().default("VIEWER"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === CONVERSATIONS (AI Receptionist) ===
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  customerContact: text("customer_contact"), // email or phone
  status: text("status", { enum: ["new", "active", "closed", "booked"] }).notNull().default("new"),
  metadata: jsonb("metadata").$type<{
    summary?: string;
    intent?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === MESSAGES ===
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === APPOINTMENTS ===
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  conversationId: integer("conversation_id").references(() => conversations.id),
  customerName: text("customer_name").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status", { enum: ["scheduled", "cancelled", "completed"] }).notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SUBSCRIPTIONS (Stripe) ===
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id).unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan", { enum: ["free", "basic", "pro", "enterprise"] }).notNull().default("free"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  users: many(users),
  conversations: many(conversations),
  appointments: many(appointments),
  subscription: one(subscriptions, {
    fields: [tenants.id],
    references: [subscriptions.tenantId],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [conversations.tenantId],
    references: [tenants.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// === ZOD SCHEMAS ===
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true });

// === TYPES ===
export type Tenant = typeof tenants.$inferSelect;
export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

// Request Types
export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string; businessName: string; slug: string };
