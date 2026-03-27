/**
 * Ficheiro de funções utilitárias para o projeto
 */

import bcrypt from 'bcryptjs';

/**
 * Criptografa a password
 * @param {string} password - Password em texto plano
 * @returns {Promise<string>} - Password criptografada
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compara password em texto plano com a criptografada
 * @param {string} password - Password em texto plano
 * @param {string} hashedPassword - Password criptografada
 * @returns {Promise<boolean>} - true se correspondem
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Formata data para string (DD/MM/YYYY)
 * @param {Date} date - Data a formatar
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formata moeda em EUR
 * @param {number} value - Valor numérico
 * @returns {string}
 */
export const formatCurrency = (value) => {
  return `€${parseFloat(value).toFixed(2)}`;
};

/**
 * Calcula total da mensalidade de um aluno
 * @param {Array} enrollments - Inscrições do aluno
 * @returns {number} - Total em EUR
 */
export const calculateMonthlyTotal = (enrollments) => {
  return enrollments.reduce((total, enrollment) => {
    return total + parseFloat(enrollment.monthlyFee);
  }, 0);
};

/**
 * Verifica se um email é válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Gera um mês-ano no formato YYYY-MM
 * @param {Date} date - Data (opcional, usa hoje por padrão)
 * @returns {string} - Ex: 2024-03
 */
export const getMonthYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Obter nome do dia da semana em português
 * @param {string} dayOfWeek - dia em inglês (monday, tuesday, etc.)
 * @returns {string}
 */
export const getPtDayOfWeek = (dayOfWeek) => {
  const days = {
    segunda: 'Segunda-feira',
    terça: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sábado: 'Sábado',
    domingo: 'Domingo',
  };
  return days[dayOfWeek] || dayOfWeek;
};

export default {
  hashPassword,
  comparePassword,
  formatDate,
  formatCurrency,
  calculateMonthlyTotal,
  isValidEmail,
  getMonthYear,
  getPtDayOfWeek,
};
