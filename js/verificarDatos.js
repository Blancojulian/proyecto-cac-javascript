import { CATEGORIAS } from './constantes.js';

/**
 * Recibe un string por el nombre o apellido y verifica si es valido.
 * @param {string} str 
 * @returns Retorna true si es valido y false sino lo es.
 */
export const esNombreOApellidoValido = (str) => /^[a-zA-ZÑñÁáÉéÍíÓóÚú]+$/.test(str);

/**
 * Recibe un string por el mail y verifica si es valido.
 * @param {string} strMail 
 * @returns Retorna true si es valido y false sino lo es.
 */
export const esMailValido = (strMail) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(strMail);
}

/**
 * Recibe un string por un numero y verifica si es un numero entero positivo valido.
 * @param {strNumero} strNumero 
 * @returns Retorna true si es valido y false sino lo es.
 */
export const esNumeroEnteroValido = (strNumero) => {
    if(typeof strNumero === 'number') strNumero = strNumero.toString();
    return !isNaN(strNumero) && strNumero !== '' &&  !strNumero.includes('.') &&  !strNumero.includes('-') && +strNumero > 0;
}

/**
 * Recibe un string por la categoria y verifica si es valida.
 * @param {string} categoria 
 * @returns Retorna true si es valido y false sino lo es.
 */
export const esCategoriaValida = (categoria) => categoria === CATEGORIAS.ESTUDIANTE || categoria === CATEGORIAS.TRAINEE || categoria === CATEGORIAS.JUNIOR;