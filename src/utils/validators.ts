import { z } from 'zod';

/**
 * Zod schema for the job application form.
 *
 * Each field uses a chain of validators so that the first failing rule
 * surfaces a descriptive error message directly shown in the UI.
 */
export const applicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes',
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),

  // Philippine mobile only — accept both local (09XXXXXXXXX) and
  // international (+63XXXXXXXXX) formats; .refine() enforces exact lengths
  contactNumber: z
    .string()
    .regex(
      /^(09|\+63)\d{9}$/,
      'Please enter a valid Philippine mobile number (09XXXXXXXX or +63XXXXXXXXXX)',
    )
    .refine(
      (val) => val.length === 11 || val.length === 13,
      'Phone number must be 11 or 13 characters',
    ),

  // Cover-letter style field — 50-char minimum ensures a meaningful answer
  // and 1000-char cap prevents database abuse
  whyShouldWeHireYou: z
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(1000, 'Response must not exceed 1000 characters'),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
