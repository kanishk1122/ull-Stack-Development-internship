function validateName(name) {
  if (!name || typeof name !== "string") {
    return "Name is required";
  }
  if (name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }
  return null;
}

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
}

function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
}

function validateAddress(address) {
  if (!address || typeof address !== "string") {
    return "Address is required";
  }
  if (address.length > 400) {
    return "Address must not exceed 400 characters";
  }
  return null;
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
};
