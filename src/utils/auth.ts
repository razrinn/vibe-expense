// Simple hash function for PIN
// In a production app, you would want to use a more secure method
export const hashPin = (pin: string): string => {
  let hash = 0;
  if (pin.length === 0) return hash.toString();

  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString();
};

export const validatePin = (pin: string): boolean => {
  // Check if pin is a 4 or 6 digit number
  return /^(\d{4}|\d{6})$/.test(pin);
};

export const setCookie = (name: string, value: string, sessionExpirationMinutes: number, enableSessionExpiration: boolean) => {
  let expires = '';
  if (enableSessionExpiration) {
    const date = new Date();
    date.setTime(date.getTime() + (sessionExpirationMinutes * 60 * 1000));
    expires = `expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
};