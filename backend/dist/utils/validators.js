"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdult = exports.isValidDate = exports.isValidPassword = exports.isValidPhoneNumber = exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
exports.isValidPhoneNumber = isValidPhoneNumber;
const isValidPassword = (password) => {
    return password.length >= 6;
};
exports.isValidPassword = isValidPassword;
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
const isAdult = (birthDate) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
};
exports.isAdult = isAdult;
