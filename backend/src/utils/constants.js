/**
 * Constantes do sistema
 */

export const ROLES = {
  ADMIN: 'admin',
  DOCENTE: 'docente',
  ALUNO: 'aluno',
};

export const ENROLLMENT_STATUS = {
  ATIVO: 'ativo',
  PAUSADO: 'pausado',
  CANCELADO: 'cancelado',
};

export const PAYMENT_STATUS = {
  PAGO: 'pago',
  PENDENTE: 'pendente',
  ATRASADO: 'atrasado',
};

export const PAYMENT_METHOD = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CARD: 'card',
};

export const SALARY_STATUS = {
  PAGO: 'pago',
  PENDENTE: 'pendente',
};

export const EVENT_TYPE = {
  CONCERTO: 'concerto',
  WORKSHOP: 'workshop',
  CONFERENCIA: 'conferência',
  COMPETICAO: 'competição',
  OUTRO: 'outro',
};

export const RSVP_STATUS = {
  CONFIRMADO: 'confirmado',
  TALVEZ: 'talvez',
  NAO_PODE: 'não_pode',
};

export const DAYS_OF_WEEK = [
  'segunda',
  'terça',
  'quarta',
  'quinta',
  'sexta',
  'sábado',
  'domingo',
];

export const INSTRUMENTS = [
  'Piano',
  'Guitarra',
  'Violino',
  'Flauta',
  'Saxofone',
  'Trompete',
  'Violoncelo',
  'Bateria',
  'Teclado',
  'Baixo',
];

export default {
  ROLES,
  ENROLLMENT_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  SALARY_STATUS,
  EVENT_TYPE,
  RSVP_STATUS,
  DAYS_OF_WEEK,
  INSTRUMENTS,
};
