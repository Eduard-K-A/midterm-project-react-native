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
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,14}$/,
      'Please enter a valid phone number',
    )
    .min(7, 'Contact number is too short')
    .max(20, 'Contact number is too long'),
  whyShouldWeHireYou: z
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(1000, 'Response must not exceed 1000 characters'),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;

