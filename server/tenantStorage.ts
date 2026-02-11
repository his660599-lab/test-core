export class TenantStorage {
  constructor(private tenantId: string) {}

  // Chat
  getConversation(id: number) {
    return db.select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, id),
          eq(conversations.tenantId, this.tenantId)
        )
      );
  }

  createConversation(conv: Omit<InsertConversation, "tenantId">) {
    return db.insert(conversations)
      .values({ ...conv, tenantId: this.tenantId })
      .returning();
  }

  getMessages(conversationId: number) {
    return db.select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.tenantId, this.tenantId)
        )
      )
      .orderBy(messages.createdAt);
  }

  createMessage(msg: Omit<InsertMessage, "tenantId">) {
    return db.insert(messages)
      .values({ ...msg, tenantId: this.tenantId })
      .returning();
  }

  // Appointments
  getAppointments() {
    return db.select()
      .from(appointments)
      .where(eq(appointments.tenantId, this.tenantId))
      .orderBy(desc(appointments.startTime));
  }

  createAppointment(appt: Omit<InsertAppointment, "tenantId">) {
    return db.insert(appointments)
      .values({ ...appt, tenantId: this.tenantId })
      .returning();
  }
}
