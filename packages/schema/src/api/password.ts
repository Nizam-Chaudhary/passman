import { z } from 'zod/v4'
import { encryptedPasswordSchema } from './common'

// Get passwords query options
export const getPasswordsQueryStringSchema = z.object({
  vaultId: z.coerce.number().min(0, 'Please provide vaultId'),
  search: z.string().min(1, 'Please enter search ').optional(),
})

export type GetPasswordsQueryOptions = z.infer<typeof getPasswordsQueryStringSchema>

// Add password
export const addPasswordSchema = z.object({
  vaultId: z.int().positive('Vault id is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less')
    .nullable()
    .optional(),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be 255 characters or less'),
  password: encryptedPasswordSchema,
  url: z.string().min(1, 'URL is required').max(255, 'URL must be 255 characters or less'),
  faviconUrl: z
    .url('Invalid favicon URL')
    .max(255, 'Favicon URL must be 255 characters or less')
    .nullable()
    .optional(),
  note: z.string().max(500, 'Note must be 500 characters or less').nullable().optional(),
})

export type AddPasswordBody = z.infer<typeof addPasswordSchema>

// Import passwords
export const importPasswordsSchema = z
  .array(addPasswordSchema)
  .min(1, 'At least one password is required for import')

export type ImportPasswordsBody = z.infer<typeof importPasswordsSchema>

// Update Password
export const updatePasswordSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less')
    .nullable()
    .optional(),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be 255 characters or less'),
  password: encryptedPasswordSchema,
  url: z.string().min(1, 'URL is required').max(255, 'URL must be 255 characters or less'),
  faviconUrl: z
    .url('Invalid favicon URL')
    .max(255, 'Favicon URL must be 255 characters or less')
    .nullable()
    .optional(),
  note: z.string().max(500, 'Note must be 500 characters or less').nullable().optional(),
})

export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>

// Delete multiple passwords
export const deleteMultiplePasswordsBodySchema = z.object({
  ids: z
    .array(z.number().int().positive('ID must be a positive integer'))
    .min(1, 'At least one ID is required'),
})

export type DeleteMultiplePasswordsBody = z.infer<typeof deleteMultiplePasswordsBodySchema>

// Move multiple passwords to a different vault
export const moveMultiplePasswordsVaultBodySchema = z.object({
  vaultId: z.number().int().positive('Vault ID must be a positive integer'),
  ids: z
    .array(z.number().int().positive('ID must be a positive integer'))
    .min(1, 'At least one ID is required'),
})

export type MoveMultiplePasswordsVaultBody = z.infer<typeof moveMultiplePasswordsVaultBodySchema>
