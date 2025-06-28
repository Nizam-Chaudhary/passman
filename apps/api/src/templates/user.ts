export function signUp(data: { userName: string; otp: string }) {
  return `
    <p>Welcome, ${data.userName} to Passman!</p
    ><br>
    <p style="font-size: 16px;">Your account OTP verification code is <strong style="color: #007bff; font-weight: bold;">${data.otp}</strong></p>
  `;
}

export function resendOtp(data: { otp: string }) {
  return `
    <p style="font-size: 16px;">Your OTP verification code is <strong style="color: #007bff; font-weight: bold;">${data.otp}</strong></p>
  `;
}

export function resetLoginPassword(data: { url: string }) {
  return `
    <p style="font-size: 16px;">Click on the link to reset your passman's login password <strong style="color: #007bff; font-weight: bold;">${data.url}</strong></p>
  `;
}
