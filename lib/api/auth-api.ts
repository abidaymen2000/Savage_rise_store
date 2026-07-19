import { AuthService, type Token, type UserOut } from "./generated"
import { withApiErrors } from "./api-error"
import type { AuthTokens, PasswordReset, PasswordResetRequest, User, UserCreate } from "@/types/api"

function userOut(user: UserOut): User {
  return user as User
}

export const authApi = {
  async signup(email: string, password: string, full_name: string): Promise<User> {
    const requestBody: UserCreate = { email, password, full_name }
    return userOut(await withApiErrors(AuthService.signupAuthSignupPost({ requestBody })))
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const token = await withApiErrors(AuthService.loginTokenAuthTokenPost({ formData: { username: email, password } as any }))
    return token as Token as AuthTokens
  },

  async verifyEmail(token: string): Promise<void> {
    await withApiErrors(AuthService.verifyEmailAuthVerifyEmailGet({ token }))
  },

  async forgotPassword(email: string): Promise<void> {
    const requestBody: PasswordResetRequest = { email }
    await withApiErrors(AuthService.forgotPasswordAuthForgotPasswordPost({ requestBody }))
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const requestBody: PasswordReset = { token, new_password: newPassword }
    await withApiErrors(AuthService.resetPasswordAuthResetPasswordPost({ requestBody }))
  },

  async resendVerification(email: string): Promise<void> {
    const requestBody: PasswordResetRequest = { email }
    await withApiErrors(AuthService.resendVerificationAuthResendVerificationPost({ requestBody }))
  },

  async resendVerificationEmail(email: string): Promise<void> {
    return this.resendVerification(email)
  },
}

