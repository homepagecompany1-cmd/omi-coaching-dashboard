import { z } from 'zod';

// Google sub は通常 21 桁の数字、余裕を持たせて 1-128 文字の英数記号
const uidSchema = z.string().min(1).max(128);
const emailSchema = z.string().email().max(254);
const nameSchema = z.string().min(1).max(128);

export const sessionUserSchema = z.object({
  id: uidSchema,
  email: emailSchema,
  name: nameSchema.optional(),
});

export const stripeCheckoutRequestSchema = z.object({
  // 現状はボディ不要（セッションから全て取得）。将来オプション追加用。
  plan: z.enum(['monthly', 'annual']).optional(),
}).strict();

export const setupTokenResultSchema = z.object({
  token: z.string().min(16).max(128),
  webhookUrl: z.string().url(),
  createdAt: z.string(),
});
