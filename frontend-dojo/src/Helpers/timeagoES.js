import {register} from 'timeago.js'

// the local dict example is below.
const localeFunc = (number, index, totalSec) => {
    // number: the timeago / timein number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
      ['justo ahora', 'ahora mismo'],
      ['Hace %s segundos ', 'En %s seconds'],
      ['Hace 1 minuto', 'En 1 minuto'],
      ['Hace %s minutos', 'En %s minutos'],
      ['Hace 1 hora', 'En 1 hora'],
      ['Hace %s horas', 'En %s horas'],
      ['Hace 1 dia', 'En 1 dia'],
      ['Hace %s dias', 'En %s dias'],
      ['Hace 1 semana', 'En 1 semana'],
      ['Hace %s semanas', 'En %s semanas'],
      ['1 mes atras', 'En 1 mes'],
      ['%s meses atras', 'En %s meses'],
      ['1 año atras', 'En 1 año'],
      ['%s años atras', 'En %s años']
    ][index];
  };
  // register your locale with timeago
  register('es', localeFunc);
   