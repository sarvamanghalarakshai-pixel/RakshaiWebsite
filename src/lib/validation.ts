import { z } from 'zod';

// Time pattern regex for HH:MM (24-hour format)
const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
// Phone pattern for 10-digit Indian numbers, optional country code prefix
const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
// Pincode pattern (6 digits)
const pincodeRegex = /^\d{6}$/;

// Astro details — ALL fields optional (users can skip if they don't know)
export const AstroDetailsSchema = z.object({
  full_name: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  birth_time: z.string().optional().or(z.literal('')),
  birth_place: z.string().optional().or(z.literal('')),
  zodiac_sign: z.string().optional().or(z.literal('')),
  birth_star: z.string().optional().or(z.literal('')),
});

// Customer schema — Name, Email, Phone, Address required; astrology optional
export const CustomerSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().regex(phoneRegex, { message: 'Enter a valid 10-digit Indian mobile number.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  pincode: z.string().regex(pincodeRegex, { message: 'Enter a valid 6-digit PIN code.' }),
  country: z.string().default('India'),
  // Astrology fields — all optional
  dob: z.string().optional().or(z.literal('')),
  birth_time: z.string().optional().or(z.literal('')),
  birth_place: z.string().optional().or(z.literal('')),
  zodiac_sign: z.string().optional().or(z.literal('')),
  birth_star: z.string().optional().or(z.literal('')),
  consent: z.literal(true, {
    message: 'You must consent to store your details.',
  }),
});

export const CheckoutPayloadSchema = z.object({
  customer: CustomerSchema,
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1.' }),
  additionalCardsCount: z.number().int().min(0).max(5),
  additionalCards: z.array(AstroDetailsSchema).max(5),
  payment_mode: z.enum(['online', 'cod']).default('online'),
});

// COD Advance payment schema — used for the ₹300 advance endpoint
export const CodAdvancePayloadSchema = z.object({
  customer: CustomerSchema,
  quantity: z.number().int().min(1),
  additionalCardsCount: z.number().int().min(0).max(5),
  additionalCards: z.array(AstroDetailsSchema).max(5),
});

export type AstroDetails = z.infer<typeof AstroDetailsSchema>;
export type CustomerDetails = z.infer<typeof CustomerSchema>;
export type CheckoutPayload = z.infer<typeof CheckoutPayloadSchema>;
export type CodAdvancePayload = z.infer<typeof CodAdvancePayloadSchema>;
