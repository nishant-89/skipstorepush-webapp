export const phoneError = "The contact number is invalid.";
export const otpNotMacthig =
  "The code you entered is incorrect, you have two (2) attempts remaining.";

export const mobileRegex = /^\d{6,15}$/;
export const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
export const numericRegex = /[0-9]/;
export const uppercaseRegex = /[A-Z]/;
export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const emojiRegex =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}]/u;

export const containsEmoji = (value: string | undefined): boolean => {
  if (!value) return false;
  return emojiRegex.test(value);
};
