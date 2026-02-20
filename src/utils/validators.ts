import { z } from 'zod';

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
  contactNumber: z
    .string()
    .regex(/^[+]63\d{10}$/, 'Please enter a valid Philippine mobile number (+63XXXXXXXXXX)')
    .length(13, 'Phone number must be in format +63XXXXXXXXXX'),
  whyShouldWeHireYou: z
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(1000, 'Response must not exceed 1000 characters'),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;

