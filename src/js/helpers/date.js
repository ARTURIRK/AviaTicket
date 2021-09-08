// Данный файл использует плагин date-fns для работы с датами для правильного преобразования даты для билетов

import { format } from 'date-fns';

/**
 * 
 * @param {String} str 
 * @param {String} type
 * 
 */
export function formatDate(str, type) {
  const date = new Date(str);
  return format(date, type);
}
