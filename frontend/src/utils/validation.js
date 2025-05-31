export const isEmailValid = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isPhoneValid = (phone) => {
  const re = /^[0-9]{10}$/; // adjust as needed
  return re.test(String(phone));
};

export const isCardNumberValid = (card) => {
  const re = /^[0-9]{16}$/;
  return re.test(String(card));
};

export const isExpiryValid = (expiry) => {
  const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!re.test(expiry)) return false;
  const [m, y] = expiry.split("/").map(v => parseInt(v, 10));
  const now = new Date();
  const input = new Date(2000 + y, m - 1, 1);
  return input > new Date(now.getFullYear(), now.getMonth(), 1);
};

export const isCVVValid = (cvv) => {
  const re = /^[0-9]{3}$/;
  return re.test(String(cvv));
};
