import { z } from 'zod/v4'

// Login
export const loginUserBodySchema = z.object({
  email: z.email('Please enter valid email'),
  password: z.string('Please enter password'),
})

export type LoginUserBody = z.infer<typeof loginUserBodySchema>

// Refresh token
export const refreshTokenBodySchema = z.object({
  refreshToken: z.jwt().describe('Invalid JWT token'),
})

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>

export interface JwtUserData {
  id: number
  userName: string
  email: string
  masterKeyCreated: boolean
  exp: number
}
