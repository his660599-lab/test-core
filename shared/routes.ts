import { z } from 'zod';
import { insertTenantSchema, insertUserSchema, insertConversationSchema, insertMessageSchema, insertAppointmentSchema, tenants, users, conversations, messages, appointments } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  serverError: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === AUTH ===
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.object({ user: z.custom<typeof users.$inferSelect>(), token: z.string().optional() }), // Basic auth usually cookies, but just in case
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        businessName: z.string(),
        slug: z.string().min(3),
      }),
      responses: {
        201: z.object({ user: z.custom<typeof users.$inferSelect>(), tenant: z.custom<typeof tenants.$inferSelect>() }),
        400: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },

  // === TENANT ===
  tenant: {
    get: {
      method: 'GET' as const,
      path: '/api/tenant' as const,
      responses: {
        200: z.custom<typeof tenants.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tenant' as const,
      input: insertTenantSchema.partial(),
      responses: {
        200: z.custom<typeof tenants.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },

  // === CONVERSATIONS ===
  conversations: {
    list: {
      method: 'GET' as const,
      path: '/api/conversations' as const,
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/conversations/:id' as const,
      responses: {
        200: z.custom<typeof conversations.$inferSelect & { messages: typeof messages.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: { // For testing or manual start
      method: 'POST' as const,
      path: '/api/conversations' as const,
      input: z.object({ customerContact: z.string().optional() }),
      responses: {
        201: z.custom<typeof conversations.$inferSelect>(),
      },
    },
  },

  // === APPOINTMENTS ===
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments' as const,
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments' as const,
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  
  // === WIDGET (Public) ===
  widget: {
    config: {
      method: 'GET' as const,
      path: '/api/widget/config' as const, // Expects ?slug=xxx or ?tenantId=xxx
      input: z.object({ slug: z.string().optional() }).optional(),
      responses: {
        200: z.object({
          name: z.string(),
          branding: z.any(),
          businessHours: z.any(),
        }),
        404: errorSchemas.notFound,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
